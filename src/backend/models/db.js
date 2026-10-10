import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const DB_FILE = path.join(path.resolve(), 'db_store.json');

// Mongoose Schemas for MongoDB
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['admin', 'student', 'officer'], default: 'student' },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  otpCode: { type: String },
  otpExpiresAt: { type: Date },
  failedOtpAttempts: { type: Number, default: 0 },
  emailVerifiedAt: { type: Date },
  verificationToken: { type: String },
}, { timestamps: true });

const ApplicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentCardId: { type: String },
  userId: { type: String, required: true },
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  phone: { type: String, required: true },
  faculty: { type: String, required: true },
  department: { type: String, required: true },
  admissionYear: { type: String, required: true },
  address: { type: String, required: true },
  photo: { type: String },
  tazkira: { type: String },
  certificate: { type: String },
  status: { type: String, default: 'Pending' },
  adminNote: { type: String },
  createdAt: { type: String, required: true },
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  recipientRole: { type: String, default: '' },
  recipientUserId: { type: String, default: '' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  studentName: { type: String, default: '' },
  studentEmail: { type: String, default: '' },
  cardStatus: { type: String, default: '' },
  adminNote: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: String, required: true },
}, { timestamps: true });

let UserModel;
let ApplicationModel;
let NotificationModel;

try {
  UserModel = mongoose.model('User', UserSchema);
} catch {
  UserModel = mongoose.model('User');
}

try {
  ApplicationModel = mongoose.model('Application', ApplicationSchema);
} catch {
  ApplicationModel = mongoose.model('Application');
}

try {
  NotificationModel = mongoose.model('Notification', NotificationSchema);
} catch {
  NotificationModel = mongoose.model('Notification');
}

class Database {
  users = [];
  applications = [];
  notifications = [];
  mongoConnected = false;

  constructor() {
    // Start initialization. We load locally first so the app works instantly,
    // and then connect to MongoDB in the background.
    this.loadLocal();
    this.initializeMongo();
  }

  async initializeMongo() {
    const uri = process.env.MONGODB_URI;
    if (uri && (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))) {
      console.log('Attempting connection to MongoDB via MONGODB_URI...');
      try {
        // Use a 5-second connection timeout so we don't hang if the URI is bad
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
        });
        this.mongoConnected = true;
        console.log('MongoDB connected successfully!');
        await this.syncFromMongo();
      } catch (err) {
        console.error('Failed to connect to MongoDB. Staying on local file store fallback. Error:', err.message);
      }
    } else {
      if (uri && uri.trim() !== "") {
        console.log('MONGODB_URI is provided but does not start with a valid scheme ("mongodb://" or "mongodb+srv://"). Continuing with local file store database.');
      } else {
        console.log('No MONGODB_URI configured. Continuing with local file store database.');
      }
    }
  }

  async syncFromMongo() {
    try {
      const dbUsers = await UserModel.find({});
      const dbApps = await ApplicationModel.find({});
      const dbNotifs = await NotificationModel.find({});

      if (dbUsers.length === 0 && dbApps.length === 0) {
        console.log('MongoDB collections are empty. Seeding initial data to MongoDB...');
        // Write local seed data to MongoDB
        const userPromises = this.users.map(u => UserModel.create(u));
        const appPromises = this.applications.map(a => ApplicationModel.create(a));
        const notifPromises = this.notifications.map(n => NotificationModel.create(n));
        await Promise.all([...userPromises, ...appPromises, ...notifPromises]);
        console.log('MongoDB successfully seeded with template student records and notifications!');
      } else {
        // Sync memory store with MongoDB values
        this.users = dbUsers.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          password: u.password,
          isEmailVerified: u.isEmailVerified !== undefined ? u.isEmailVerified : true,
          otpCode: u.otpCode,
          otpExpiresAt: u.otpExpiresAt,
          failedOtpAttempts: u.failedOtpAttempts || 0,
          emailVerifiedAt: u.emailVerifiedAt,
          verificationToken: u.verificationToken,
        }));
        this.applications = dbApps.map(a => ({
          id: a.id,
          studentCardId: a.studentCardId || `HU-${a.admissionYear || '2026'}-${Math.floor(10000 + Math.random() * 90000)}`,
          userId: a.userId,
          fullName: a.fullName,
          fatherName: a.fatherName,
          phone: a.phone,
          faculty: a.faculty,
          department: a.department,
          admissionYear: a.admissionYear,
          address: a.address,
          photo: a.photo,
          tazkira: a.tazkira,
          certificate: a.certificate,
          status: a.status,
          adminNote: a.adminNote,
          createdAt: a.createdAt,
        }));
        this.notifications = dbNotifs.map(n => ({
          id: n.id,
          recipientRole: n.recipientRole || '',
          recipientUserId: n.recipientUserId || '',
          title: n.title,
          message: n.message,
          type: n.type || 'info',
          studentName: n.studentName || '',
          studentEmail: n.studentEmail || '',
          cardStatus: n.cardStatus || '',
          adminNote: n.adminNote || '',
          isRead: !!n.isRead,
          createdAt: n.createdAt,
        }));
        console.log(`Successfully synced memory store with MongoDB. Users: ${this.users.length}, Applications: ${this.applications.length}, Notifications: ${this.notifications.length}`);
      }
    } catch (err) {
      console.error('Error syncing data from MongoDB collections:', err);
    }
  }

  loadLocal() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        this.users = (data.users || []).map((u) => ({
          ...u,
          isEmailVerified:
            u.isEmailVerified !== undefined
              ? u.isEmailVerified
              : u.emailVerified !== undefined
              ? u.emailVerified
              : true,
        }));
        this.applications = data.applications || [];
        this.notifications = (data.notifications || []).map((n) => ({
          ...n,
          id: n.id || `notif_${Date.now()}_${Math.random()}`,
          recipientUserId: n.recipientUserId || n.userId || '',
          recipientRole:
            n.recipientRole ||
            (n.userId === 'usr_default_admin' || n.userId === 'u-admin-1'
              ? 'admin'
              : ''),
          isRead:
            n.isRead !== undefined
              ? Boolean(n.isRead)
              : Boolean(n.read),
          title: n.title || 'Notification',
          message: n.message || '',
          type: n.type || 'info',
          createdAt: n.createdAt || new Date().toISOString(),
        }));
        console.log(`Database loaded successfully from local cache. Users: ${this.users.length}, Apps: ${this.applications.length}, Notifs: ${this.notifications.length}`);
      } else {
        this.seedInitialArrays();
      }
    } catch (err) {
      console.error('Error loading local database cache, seeding fallback:', err);
      this.seedInitialArrays();
    }
  }

  saveLocal() {
    try {
      const dataStr = JSON.stringify(
        {
          users: this.users,
          applications: this.applications,
          notifications: this.notifications,
        },
        null,
        2
      );
      fs.writeFile(DB_FILE, dataStr, 'utf8', (err) => {
        if (err) console.error('Error saving database to local cache:', err);
      });
    } catch (err) {
      console.error('Error serializing database to local cache:', err);
    }
  }

  async save() {
    // 1. Save to local JSON file for backup redundancy
    this.saveLocal();

    // 2. If MongoDB is active, reconcile changes in the background
    if (this.mongoConnected) {
      try {
        const userPromises = this.users.map(u =>
          UserModel.updateOne({ id: u.id }, { $set: u }, { upsert: true })
        );
        const appPromises = this.applications.map(a =>
          ApplicationModel.updateOne({ id: a.id }, { $set: a }, { upsert: true })
        );
        const notifPromises = this.notifications.map(n =>
          NotificationModel.updateOne({ id: n.id }, { $set: n }, { upsert: true })
        );

        // Remove any deleted documents
        const currentAppIds = this.applications.map(a => a.id);
        const deleteAppPromise = ApplicationModel.deleteMany({ id: { $nin: currentAppIds } });

        const currentUserIds = this.users.map(u => u.id);
        const deleteUserPromise = UserModel.deleteMany({ id: { $nin: currentUserIds } });

        const currentNotifIds = this.notifications.map(n => n.id);
        const deleteNotifPromise = NotificationModel.deleteMany({ id: { $nin: currentNotifIds } });

        await Promise.all([...userPromises, ...appPromises, ...notifPromises, deleteAppPromise, deleteUserPromise, deleteNotifPromise]);
        console.log('Changes successfully replicated to MongoDB collections.');
      } catch (err) {
        console.error('Error synchronizing memory state to MongoDB:', err);
      }
    }
  }

  addNotification(notifData) {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientRole: notifData.recipientRole || '',
      recipientUserId: notifData.recipientUserId || '',
      title: notifData.title || 'Notification',
      message: notifData.message || '',
      type: notifData.type || 'info', // 'registration' | 'approval' | 'rejection' | 'correction' | 'application'
      studentName: notifData.studentName || '',
      studentEmail: notifData.studentEmail || '',
      cardStatus: notifData.cardStatus || '',
      adminNote: notifData.adminNote || '',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }

  seedInitialArrays() {
    console.log('Seeding initial system users & student data...');
    this.users = [
      {
        id: 'u-admin-1',
        name: 'Dean Administration',
        email: 'admin@university.edu',
        role: 'admin',
        password: 'admin123',
        isEmailVerified: true,
      },
      {
        id: 'u-student-1',
        name: 'Ahmad Zahir',
        email: 'student@university.edu',
        role: 'student',
        password: 'student123',
        isEmailVerified: true,
      },
      {
        id: 'u-student-2',
        name: 'Fatima Sadat',
        email: 'fatima@university.edu',
        role: 'student',
        password: 'student123',
        isEmailVerified: true,
      },
      {
        id: 'u-student-3',
        name: 'Mustafa Qasemi',
        email: 'mustafa@university.edu',
        role: 'student',
        password: 'student123',
        isEmailVerified: true,
      },
      {
        id: 'u-student-4',
        name: 'Maryam Noori',
        email: 'maryam@university.edu',
        role: 'student',
        password: 'student123',
        isEmailVerified: true,
      },
    ];

    this.applications = [
      {
        id: 'app-student-1',
        studentCardId: 'HU-2026-88021',
        userId: 'u-student-1',
        fullName: 'Ahmad Zahir',
        fatherName: 'Mohammad Zahir',
        phone: '+93 78 123 4567',
        faculty: 'Computer Science',
        department: 'Software Engineering',
        admissionYear: '2026',
        address: 'Kabul, Afghanistan',
        photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
        tazkira: 'Scanned Tazkira #CS-89230',
        certificate: 'High School Diploma (Shir Shah Suri HS)',
        status: 'Pending',
        adminNote: 'Awaiting visual review of academic transcript files.',
        createdAt: new Date('2026-05-18T10:30:00Z').toISOString(),
      },
      {
        id: 'app-student-2',
        studentCardId: 'HU-2026-11234',
        userId: 'u-student-2',
        fullName: 'Fatima Sadat',
        fatherName: 'Sayed Jalal',
        phone: '+93 79 987 6543',
        faculty: 'Dentistry',
        department: 'Dental Surgery',
        admissionYear: '2026',
        address: 'Herat, Afghanistan',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        tazkira: 'Scanned Tazkira #HR-11234',
        certificate: 'High School Graduation Certificate (Herat Girls HS)',
        status: 'Approved',
        adminNote: 'All identification documents verified and verified entry level requirements satisfied.',
        createdAt: new Date('2026-05-15T08:15:00Z').toISOString(),
      },
      {
        id: 'app-student-3',
        studentCardId: 'HU-2025-99081',
        userId: 'u-student-3',
        fullName: 'Mustafa Qasemi',
        fatherName: 'Mirwais Qasemi',
        phone: '+93 70 555 4433',
        faculty: 'Pharmacy',
        department: 'Pharmacology & Clinical Pharmacy',
        admissionYear: '2025',
        address: 'Mazar-i-Sharif, Afghanistan',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        tazkira: 'Scanned Tazkira #MZ-99081',
        certificate: 'A-Grade Transcript (Bakhtar Lycee)',
        status: 'Need Correction',
        adminNote: 'The Tazkira scan was heavily blurred. Please upload a high-resolution, readable scan.',
        createdAt: new Date('2026-05-20T14:22:00Z').toISOString(),
      },
      {
        id: 'app-student-4',
        studentCardId: 'HU-2026-44109',
        userId: 'u-student-4',
        fullName: 'Maryam Noori',
        fatherName: 'Abdul Rahman Noori',
        phone: '+93 77 333 8899',
        faculty: 'Law Faculty',
        department: 'Public & International Law',
        admissionYear: '2026',
        address: 'Kabul, Afghanistan',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        tazkira: 'Scanned Tazkira #KB-44109',
        certificate: 'High School Diploma (Zarghona High School)',
        status: 'Approved',
        adminNote: 'Academic credentials and legal aptitude qualifications verified.',
        createdAt: new Date('2026-05-22T09:10:00Z').toISOString(),
      },
    ];

    this.notifications = [
      {
        id: 'notif-seed-1',
        recipientRole: 'admin',
        recipientUserId: '',
        title: '🎓 New Student Registered',
        message: 'New student Ahmad Zahir (student@university.edu) registered on the portal.',
        type: 'registration',
        studentName: 'Ahmad Zahir',
        studentEmail: 'student@university.edu',
        isRead: false,
        createdAt: new Date('2026-05-18T10:31:00Z').toISOString(),
      },
      {
        id: 'notif-seed-2',
        recipientRole: 'student',
        recipientUserId: 'u-student-2',
        title: '🎉 Student ID Card Approved',
        message: 'Congratulations! Your Student ID Card has been approved. You can now view and download your card.',
        type: 'approval',
        studentName: 'Fatima Sadat',
        cardStatus: 'Approved',
        adminNote: 'All identification documents verified.',
        isRead: false,
        createdAt: new Date('2026-05-15T08:20:00Z').toISOString(),
      },
      {
        id: 'notif-seed-3',
        recipientRole: 'student',
        recipientUserId: 'u-student-3',
        title: '✏️ ID Card Application Correction Required',
        message: 'Action required: The Tazkira scan was heavily blurred. Please upload a high-resolution, readable scan.',
        type: 'correction',
        studentName: 'Mustafa Qasemi',
        cardStatus: 'Need Correction',
        adminNote: 'The Tazkira scan was heavily blurred. Please upload a high-resolution, readable scan.',
        isRead: false,
        createdAt: new Date('2026-05-20T14:25:00Z').toISOString(),
      }
    ];

    this.saveLocal();
  }

  resetToDemo() {
    this.seedInitialArrays();
    this.save();
  }
}

export const db = new Database();
