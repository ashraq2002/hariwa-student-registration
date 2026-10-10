import { db } from '../models/db.js';

export const upsertApplication = (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'student') {
    return res.status(403).json({ error: 'Only registered students are permitted to submit enrollment application forms' });
  }

  const {
    fullName,
    fatherName,
    phone,
    faculty,
    department,
    admissionYear,
    address,
    photo,
    tazkira,
    certificate,
  } = req.body;

  if (!fullName || !fatherName || !phone || !faculty || !department || !admissionYear || !address) {
    return res.status(400).json({ error: 'Please fill in all mandatory student profile information fields.' });
  }

  if (!photo || !photo.trim()) {
    return res.status(400).json({ error: 'Passport Photo is required. Please upload your passport photo.' });
  }

  if (!tazkira || !tazkira.trim()) {
    return res.status(400).json({ error: 'Tazkira or ID Scan document is required. Please upload your Tazkira scan.' });
  }

  if (!certificate || !certificate.trim()) {
    return res.status(400).json({ error: 'High School Diploma transcript is required. Please upload your diploma scan.' });
  }

  // Check if user already has an application
  let appIndex = db.applications.findIndex((a) => a.userId === user.id);

  if (appIndex !== -1) {
    // Update existing application
    const existing = db.applications[appIndex];
    const updated = {
      ...existing,
      studentCardId: existing.studentCardId || `HU-${admissionYear}-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName,
      fatherName,
      phone,
      faculty,
      department,
      admissionYear,
      address,
      photo: photo || existing.photo || '',
      tazkira: tazkira || existing.tazkira || '',
      certificate: certificate || existing.certificate || '',
      status: 'Pending', // resets status to review mode on resubmission
      adminNote: 'Application updated by student. Awaiting review.',
      createdAt: new Date().toISOString(),
    };
    db.applications[appIndex] = updated;
    
    // Notify admin of updated application
    db.addNotification({
      recipientRole: 'admin',
      title: '📝 Enrollment Application Updated',
      message: `${fullName} (${faculty} - ${department}) updated their enrollment application details.`,
      type: 'application',
      studentName: fullName,
    });

    db.save();
    return res.json({ message: 'Enrollment form updated successfully', application: updated });
  } else {
    // Create new application
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const studentCardId = `HU-${admissionYear}-${randomNum}`;
    const newApp = {
      id: `app-student-${Date.now()}`,
      studentCardId,
      userId: user.id,
      fullName,
      fatherName,
      phone,
      faculty,
      department,
      admissionYear,
      address,
      photo: photo || '',
      tazkira: tazkira || '',
      certificate: certificate || '',
      status: 'Pending',
      adminNote: 'Newly submitted application. Awaiting administration review.',
      createdAt: new Date().toISOString(),
    };
    db.applications.push(newApp);

    // Notify admin of new application submission
    db.addNotification({
      recipientRole: 'admin',
      title: '📝 New Application Submitted',
      message: `${fullName} (${faculty} - ${department}) submitted an enrollment application form.`,
      type: 'application',
      studentName: fullName,
    });

    db.save();
    return res.status(201).json({ message: 'Enrollment form submitted successfully', application: newApp });
  }
};

export const getMyApplication = (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'student') {
    return res.status(403).json({ error: 'Access restricted to students' });
  }

  const application = db.applications.find((a) => a.userId === user.id);
  res.json(application || null);
};

export const getAllApplications = (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrative role authorization required' });
  }

  res.json(db.applications);
};

export const getApplicationDetails = (req, res) => {
  const user = req.user;
  const { id } = req.params;

  const application = db.applications.find((a) => a.id === id);
  if (!application) {
    return res.status(404).json({ error: 'Application record not found' });
  }

  // Ensure matching authorization
  if (!user || (user.role !== 'admin' && application.userId !== user.id)) {
    return res.status(403).json({ error: 'Unauthorized database transaction access' });
  }

  res.json(application);
};

export const updateApplicationStatus = (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Privileged administration authorization required' });
  }

  const { id } = req.params;
  const { status, adminNote } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Workflow update status is required' });
  }

  const appIndex = db.applications.findIndex((a) => a.id === id);
  if (appIndex === -1) {
    return res.status(404).json({ error: 'Student registration record not found' });
  }

  const currentApp = db.applications[appIndex];
  const updatedNote = adminNote || currentApp.adminNote || '';
  db.applications[appIndex] = {
    ...currentApp,
    status,
    adminNote: updatedNote,
  };

  // Dispatch student notification when status changes
  let notifTitle = 'Student Card Status Updated';
  let notifMessage = `Your Hariwa University Student Card status has been updated to ${status}.`;
  let notifType = 'info';

  if (status === 'Approved') {
    notifTitle = '🎉 Student ID Card Approved';
    notifMessage = `Congratulations! Your Student ID Card has been approved. You can now view and download your official card (${currentApp.studentCardId || 'ID Card'}).`;
    notifType = 'approval';
  } else if (status === 'Rejected') {
    notifTitle = '⚠️ Student ID Card Rejected';
    notifMessage = `Your Student ID Card application has been rejected.${updatedNote ? ` Reason: ${updatedNote}` : ''}`;
    notifType = 'rejection';
  } else if (status === 'Need Correction') {
    notifTitle = '✏️ ID Card Application Correction Required';
    notifMessage = `Action required on your ID card application.${updatedNote ? ` Note: ${updatedNote}` : ''}`;
    notifType = 'correction';
  }

  db.addNotification({
    recipientUserId: currentApp.userId,
    recipientRole: 'student',
    title: notifTitle,
    message: notifMessage,
    type: notifType,
    studentName: currentApp.fullName,
    cardStatus: status,
    adminNote: updatedNote,
  });

  db.save();

  res.json({
    message: 'Applicant workflow updated securely',
    application: db.applications[appIndex],
  });
};

export const deleteApplication = (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrative privilege required' });
  }

  const { id } = req.params;
  const initialLength = db.applications.length;
  db.applications = db.applications.filter((a) => a.id !== id);

  if (db.applications.length === initialLength) {
    return res.status(404).json({ error: 'Student enrollment registration target not found' });
  }

  db.save();
  res.json({ message: 'Application deleted from active registry' });
};

export const getStats = (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access restricted' });
  }

  const apps = db.applications;
  const stats = {
    totalStudents: apps.length,
    pendingStudents: apps.filter((a) => a.status === 'Pending').length,
    approvedStudents: apps.filter((a) => a.status === 'Approved').length,
    rejectedStudents: apps.filter((a) => a.status === 'Rejected').length,
    correctionRequired: apps.filter((a) => a.status === 'Need Correction').length,
  };

  res.json(stats);
};
