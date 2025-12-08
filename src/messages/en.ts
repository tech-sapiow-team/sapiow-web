export default {
  // Common
  hello: "Hello",
  continue: "Continue",
  cancel: "Cancel",
  accept: "Accept",
  loading: "Loading...",
  error: "Error",
  success: "Success",
  today: "Today",
  patient: "Patient",
  session: "Session",

  // Login Page
  login: {
    title: "Enter your phone number",
    subtitle: "You will receive a code to log in.",
    sendingCode: "Sending...",
    legalText: "By clicking continue, I accept the",
    termsOfService: "Terms of Use",
    and: "and the",
    privacyPolicy: "Privacy Policy",
    ofSapiow: "of Sapiow.",
  },

  // Verify Code Page
  verify: {
    title: "Enter the 6-digit code received by SMS",
    noCodeReceived: "Didn't receive the code?",
    resend: "Resend",
    sending: "Sending...",
    changeNumber: "Change number",
    verifying: "Verifying...",
  },

  // Onboarding
  onboarding: {
    checkingProfile: "Checking your profile...",
    whatDoYouWant: "What do you want to do on Sapiow?",
    lookingForExpert: "I'm looking for an expert",
    iAmExpert: "I am an expert",
    // Common
    letsGetAcquainted: "Let's get acquainted",
    next: "Next",
    confirm: "Confirm",
    registering: "Registering...",
    errorOccurred: "An error occurred during registration",
    // Personal info
    firstName: "Your first name",
    lastName: "Your last name",
    email: "Your email",
    profession: "Your profession",
    // Seeker specific
    personalizeExperience:
      "We need some information to personalize your experience.",
    preferredDomain: "Your preferred domain?",
    highlightExperts: "We will highlight the experts that interest you most.",
    // Expert specific
    createExpertAccount:
      "We need some information to create your Expert account.",
    exerciseDomain: "What domain do you practice in?",
    needDomainInfo:
      "We need to know your domain of expertise to offer you the best opportunities.",
    specialties: "Your specialties",
    chooseSpecialties: "Choose your specialties in the selected domain.",
    chooseYourSpecialties: "Choose your specialties",
    loadingExpertises: "Loading expertises...",
    noExpertisesAvailable: "No expertise available for this domain",
    aboutYou: "Tell us about yourself",
    describeYourself:
      "Describe yourself in a few words so your future clients can get to know you better.",
    aboutMePlaceholder:
      "Tell us about your background, your skills and what you are passionate about in your field...",
    linkedinUrl: "LinkedIn URL (optional)",
    websiteUrl: "Website (optional)",
    profilePhoto: "Profile photo",
    addProfilePhoto:
      "Add a profile photo so your clients can easily identify you.",
    visioConfig: "Video configuration",
    configureServices: "Configure your video consultation services.",
    skipForNow: "Skip for now",
    completeProfile: "Complete my profile",
    later: "Later",
    validate: "Validate",
    skip: "Skip",
    finish: "Finish",
  },

  // Visios/Appointments
  visios: {
    upcoming: "Upcoming",
    pending: "Pending",
    history: "History",
    noUpcomingVisios: "No upcoming confirmed video calls",
    noPendingRequests: "No pending requests",
    noHistoryVisios: "No video calls in history",
    startVideo: "Start video call",
    duration: "45min",
    cancelled: "Cancelled",
    completed: "Completed",
    // Session Card
    sessionDuration: "video call of",
    viewDetails: "View details",
    viewRequest: "View request",
    calendarAlt: "calendar",
    clockAlt: "clock",
    // Session Modal
    sessionDetail: "Video call details",
    pendingRequest: "Pending request",
    requestedBy: "Requested by:",
    sessionName: "Session name:",
    questionsComments: "Questions or comments",
    close: "Close",
    refuse: "Decline",
    confirming: "Confirming...",
    cancelling: "Cancelling...",
    // Client page
    myVideoConferences: "My video conferences",
    sessionInProgress: "Session in progress",
    loadingVideoConferences: "Loading your video conferences...",
    imminentAppointment: "Imminent appointment",
    upcomingVideo: "Upcoming video",
    nextVideos: "Next videos",
    noConfirmedUpcoming: "No confirmed upcoming video conferences",
    noOtherScheduled: "No other scheduled video conferences",
  },

  // Navigation
  nav: {
    home: "Home",
    messages: "Messages",
    visios: "Video Calls",
    favorites: "Favorites",
    account: "Account",
  },

  // Messages
  messages: {
    selectConversation: "Select a conversation",
    selectConversationToView: "Select a conversation to view messages",
    loadingConversations: "Loading conversations...",
    errorLoadingMessages: "Error loading messages",
    noMessagesInConversation: "No messages in this conversation",
    today: "Today",
    // Message Input
    messagePlaceholder: "Your message",
    unsupportedFileType: "Unsupported file type",
    fileAttached: "📎",
    imageAttached: "🖼️",
    photoTaken: "📷 Photo taken",
    audioRecording: "🎤 Audio recording",
    cameraAccessError: "Unable to access camera",
    microphoneAccessError: "Unable to access microphone",
    takePhoto: "Take a photo",
    takePhotoButton: "📷 Take photo",
    sendingError: "Error sending message:",
    cameraAccessErrorLog: "Camera access error:",
    microphoneAccessErrorLog: "Microphone access error:",
    // Conversations List
    conversationError: "Error:",
    noConversationsFound: "No conversations found",
  },

  // Availability Buttons
  availabilityButtons: {
    manageAvailability: "Manage my availability",
    syncCalendars: "Sync my calendars",
  },

  // Availability Sheet
  availabilitySheet: {
    title: "Manage my availability",
    availablePeriod: "Available period",
    availability: "Availability",
    availableDays: "Available days",
    startDate: "Start date",
    endDate: "End date",
    selectPeriod: "Select a period",
    unavailable: "Unavailable",
    session: "session",
    sessions: "sessions",
    addSession: "Add session",
    to: "to",
    noPeriodDefined: "No period defined",
    save: "Save",
    saving: "Saving...",
    // Days of the week
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    // Time periods
    oneMonth: "1 month",
    threeMonths: "3 months",
    sixMonths: "6 months",
    oneYear: "1 year",
    month: "month",
    months: "months",
    day: "day",
    days: "days",
  },

  // Time Slots Manager
  timeSlotsManager: {
    selectDatePrompt: "Select a date to manage time slots",
    saving: "Saving...",
    addAvailability: "Add availability",
    to: "to",
    selectStartTime: "Start time",
    selectEndTime: "End time",
  },

  // Block Day Section
  blockDaySection: {
    question: "Availability for this day?",
    blocked: "Blocked",
    unblocked: "Unblocked",
    title: "Block this day?",
    description: "It is not possible to have a session on this date.",
    unblockTitle: "Unblock this day?",
    unblockDescription: "Allow bookings for this date.",
  },

  // Disponibilites Page
  disponibilites: {
    sessionDetails: "Session details",
    googleCalendarSync: "Google Calendar synchronization",
    googleCalendarDescription:
      "Connect your Google account to avoid double bookings.",
    googleCalendar: "Google Calendar",
    connected: "Connected",
    connectedSince: "Connected since",
    notConnected: "Not connected",
    connect: "Connect",
    disconnect: "Disconnect",
    syncAutomatic:
      "Synchronization is automatic! Your appointments are synced every 15 minutes.",
  },

  // Google Calendar Connect
  googleCalendarConnect: {
    connecting: "Connecting...",
    connectButton: "Connect Google Calendar",
  },

  // OAuth Callback
  oauthCallback: {
    connecting: "Connecting to Google Calendar...",
    pleaseWait: "Please wait",
    error: "Error",
    redirecting: "Redirecting to availability page...",
    missingCode: "Authorization code missing",
    connectionError: "Connection error",
    processingError: "Error processing connection",
  },

  // Synced Calendars Sheet
  syncedCalendars: {
    title: "Synced calendars",
    disconnect: "Disconnect",
    disconnecting: "Disconnecting...",
    addCalendar: "Add a calendar",
  },

  // Visio Sessions Config
  visioSessionsConfig: {
    loadingSessions: "Loading sessions...",
    loadingError: "Error loading sessions",
    price: "Price",
    expectations: "Expectations",
    questionExamples: "Question examples",
    // Expectations list
    expectation1: "Ask three or more questions",
    expectation2: "Advice for starting a successful business",
    expectation3: "Advice for getting your first 10,000 customers",
    expectation4: "Growth tips and startup scaling",
    // Question examples
    question1:
      "I'm thinking about starting a business. What are the next things I should focus on?",
    question2: "How do I know if my business idea will work?",
    question3: "How should I approach growing my startup?",
  },

  // Payment Page
  paymentPage: {
    pay: "Pay",
    loading: "Loading...",
    paymentError: "Payment error",
    orderSummary: "Order Summary",
    sessionWith: "Session with",
    quantity: "Qty",
    subtotal: "Subtotal",
    tax: "Tax",
    totalAmount: "Total Amount",
    addPromoCode: "Add promo code",
    payWithoutLink: "Pay without Link",
  },

  // Account Pages
  account: {
    profile: "My Profile",
    availability: "My Availability",
    offers: "My Offers",
    revenue: "Revenue",
    paymentHistory: "Payment History",
    notifications: "Notifications",
    language: "Language",
    support: "Need Help?",
    about: "About",
    legalMentions: "Legal Mentions",
    logout: "Logout",
    loggingOut: "Logging out...",
    switchToExpert: "Switch to Expert Mode",
    switchToClient: "Switch to Client Mode",
    becomeExpert: "Become an Expert",
    becomeExpertDescription:
      "Become an expert and access our platform to offer video consultations to your audience.",
    learnMore: "Learn More",
    becomeExpertButton: "Become Expert",
  },

  // Profile Pages
  profile: {
    loadingProfile: "Loading profile...",
    errorLoadingProfile: "Error loading profile:",
    errorUpdatingProfile: "Error updating profile:",
    // Form fields
    yourJob: "Your job",
    yourName: "Your name",
    linkedinLink: "LinkedIn link",
    website: "Website",
    expertiseDomain: "Expertise domain",
    noDomains: "No domains available",
    aboutYouPlaceholder: "About you",
    // Expertises
    specialties: "Specialties",
    loadingExpertises: "Loading specialties...",
    noExpertisesAvailable: "No specialties available for this domain",
    specialtiesSelected: "specialty(ies) selected",
    // Actions
    deleteAccount: "Delete my account",
    saving: "Saving...",
    saveChanges: "Save changes",
    // Photo Upload
    deletePhoto: "Delete photo",
    uploading: "Uploading...",
    changePhoto: "Change photo",
    addPhoto: "Add photo",
    profilePhotoAlt: "Profile photo",
    userIconAlt: "User icon",
    uploadIconAlt: "Upload icon",
    // Delete Account Modal
    deleteAccountConfirmation: "Are you sure you want to delete your account?",
    deleteAccountWarning:
      "This action is irreversible. All your data will be permanently deleted.",
    cancelDelete: "Cancel",
    confirmDelete: "Delete",
    deleting: "Deleting...",
    cannotDeleteWithAppointments:
      "Cannot delete your account. You have pending or confirmed appointments. Please cancel or complete all your appointments first.",
  },

  // Notification Settings
  notificationSettings: {
    appointmentNotifications: "Appointment Notifications",
    messageNotifications: "Message Notifications",
    promotionsNotifications: "Promotions & Special Offers",
    errorLoadingSettings: "Error loading notification settings",
    errorUpdatingSettings: "Error updating settings",
    // Page UI
    loadingSettings: "Loading settings...",
    smsNotifications: "SMS Notifications",
    emailNotifications: "Email Notifications",
  },

  // Legal Mentions
  legalMentions: {
    termsOfService: "Terms of Use",
    privacyPolicy: "Privacy Policy",
    openSourceLicenses: "Open Source Licenses",
    termsContent:
      "These Terms of Use govern the use of the Sapiow platform, accessible via our website and mobile application. Sapiow is a platform that allows experts to register and offer their services, and clients to view the list of available experts to schedule appointments with them. By using Sapiow, you agree to comply with these Terms of Use. Sapiow reserves the right to modify these terms at any time, and users will be informed of significant changes. Continued use of the platform after modification of the Terms of Use constitutes acceptance of these changes. Experts commit to providing accurate and up-to-date information regarding their profile, skills, and availability. Clients commit to respecting scheduled appointments and canceling within a reasonable timeframe if necessary. Sapiow is not responsible for the quality of services provided by experts, but strives to maintain a community of qualified experts.",
    privacyContent: `<h1><strong>Privacy Policy – Sapiow</strong></h1>

<p><strong>Last updated:</strong> 30/10/2025</p>

<p>This Privacy Policy explains how <strong>Sapiow</strong> (“we”, “our”, “us”) collects, uses, shares, and protects your personal information when you use our platform connecting individuals and experts.</p>

<p>We take your privacy seriously and are committed to handling your data in accordance with the <strong>General Data Protection Regulation (GDPR)</strong>, applicable privacy laws, and the data protection requirements of <strong>Google</strong> and <strong>Stripe</strong>.</p>

<h2><strong>1. Information We Collect</strong></h2>

<p>We only collect the information necessary to provide and improve our services.</p>

<h3>a. Information You Provide Directly</h3>

<ul>
  <li>Full name</li>
  <li>Email address</li>
  <li>Phone number</li>
  <li>Profile photo (optional)</li>
  <li>Professional skills, experience, and availability (for experts)</li>
  <li>Messages or information exchanged through the platform</li>
</ul>

<h3>b. Information from Google</h3>

<p>If you choose to connect your <strong>Google Account</strong>, we may access:</p>

<ul>
  <li>Your <strong>Google email address</strong></li>
  <li>Your <strong>Google profile name</strong> and <strong>profile picture</strong></li>
  <li>
    <p>Your <strong>Google Calendar data</strong>, specifically to:</p>
    <ul>
      <li><strong>Create</strong>, <strong>edit</strong>, and <strong>delete</strong> calendar events related to appointments made through Sapiow</li>
      <li><strong>Synchronize your availability</strong> to prevent scheduling conflicts</li>
    </ul>
  </li>
</ul>

<p>We <strong>never access your Gmail messages, Drive files, contacts, or any other unrelated Google data</strong>.</p>

<h3>c. Payment Information (via Stripe)</h3>

<p>Payments on Sapiow are processed securely through <strong>Stripe</strong>, a PCI-DSS certified payment processor.
We <strong>do not store or process</strong> your credit card or bank information on our servers.
All payment details are transmitted directly to Stripe and handled in accordance with their <a href="https://stripe.com/privacy">Privacy Policy</a>.</p>

<h3>d. Technical Information</h3>

<p>We may collect limited technical data such as:</p>

<ul>
  <li>IP address</li>
  <li>Browser type and operating system</li>
  <li>Device information</li>
  <li>Cookies and connection logs (see our Cookie Policy if applicable)</li>
</ul>

<h2><strong>2. How We Use Your Information</strong></h2>

<p>We use your data solely for the purposes of:</p>

<ul>
  <li>Managing your account and authentication</li>
  <li>Facilitating connections between clients and experts</li>
  <li>Scheduling and synchronizing appointments (via Google Calendar)</li>
  <li>Processing secure payments and invoices (via Stripe)</li>
  <li>Sending notifications, reminders, and service updates</li>
  <li>Improving the quality and security of our platform</li>
  <li>Providing customer support</li>
</ul>

<p>We <strong>do not sell</strong> your data or use it for advertising purposes.
Google and Stripe data are used <strong>only as required to deliver core platform functionality</strong>.</p>

<h2><strong>3. Data Sharing</strong></h2>

<p>We share your data only when necessary:</p>

<ul>
  <li>With <strong>technical service providers</strong> (hosting, messaging, authentication) under strict confidentiality agreements;</li>
  <li>With <strong>Stripe</strong> for secure payment processing;</li>
  <li>With <strong>Google</strong> only when you have granted explicit permission for Calendar access;</li>
  <li>With <strong>law enforcement or authorities</strong> when required by law.</li>
</ul>

<p>We never share or sell your information for marketing purposes.</p>

<h2><strong>4. Data Storage and Security</strong></h2>

<p>We implement robust technical and organizational measures to protect your data, including:</p>

<ul>
  <li>Encryption in transit (HTTPS / TLS) and at rest;</li>
  <li>Secure servers located within the European Union or in GDPR-compliant regions;</li>
  <li>Strict access controls and activity logging;</li>
  <li>Regular security audits and software updates.</li>
</ul>

<p>Google and Stripe data are stored and processed in accordance with their respective security standards.
Sapiow does <strong>not locally store Google or Stripe data</strong> beyond what is strictly necessary.</p>

<h2><strong>5. Data Retention</strong></h2>

<ul>
  <li>We retain your personal data <strong>for as long as your account remains active</strong> or as needed to provide our services.</li>
  <li>You may request <strong>account deletion</strong> at any time (see Section 6).</li>
  <li>Payment-related data may be retained for up to <strong>10 years</strong> in accordance with legal obligations.</li>
  <li>Google authorizations automatically expire if you revoke access through your Google Account.</li>
</ul>

<h2><strong>6. Your Rights</strong></h2>

<p>Under the GDPR and applicable data protection laws, you have the right to:</p>

<ul>
  <li><strong>Access</strong> your personal data;</li>
  <li><strong>Correct</strong> inaccurate information;</li>
  <li><strong>Delete</strong> your personal data (“right to be forgotten”);</li>
  <li><strong>Restrict or object</strong> to certain processing activities;</li>
  <li><strong>Port</strong> your data to another service;</li>
  <li><strong>Withdraw consent</strong> at any time for Google or Stripe integrations.</li>
</ul>

<p>To exercise these rights, please contact us at:
<strong><a href="mailto:contact@sapiow.com">contact@sapiow.com</a></strong></p>

<h2><strong>7. Deleting Google and Stripe Data</strong></h2>

<p>You can take the following actions at any time:</p>

<ul>
  <li><strong>Revoke Google access</strong> by visiting <a href="https://myaccount.google.com/permissions">https://myaccount.google.com/permissions</a></li>
  <li><strong>Delete your Sapiow account</strong>, which permanently removes all associated data, including synchronized calendar events</li>
  <li><strong>Contact Stripe</strong> regarding payment data at <a href="mailto:privacy@stripe.com">privacy@stripe.com</a></li>
</ul>

<h2><strong>8. International Data Transfers</strong></h2>

<p>Some of our service providers (including Google and Stripe) may process data outside the European Union.
Such transfers occur only to countries recognized by the <strong>European Commission</strong> as providing an adequate level of protection or are governed by <strong>Standard Contractual Clauses (SCCs)</strong>.</p>

<h2><strong>9. Updates to This Policy</strong></h2>

<p>We may update this Privacy Policy from time to time to reflect legal, technical, or operational changes.
The latest version will always be available at <strong><a href="https://sapiow-jfmsga3sp-betech-projects.vercel.app/mentions-legales">https://sapiow-jfmsga3sp-betech-projects.vercel.app/mentions-legales</a></strong>.
We encourage you to review it periodically.</p>

<h2><strong>10. Contact Us</strong></h2>

<p>If you have any questions or concerns about this Privacy Policy or your personal data, please contact us at:</p>

<p><strong>Sapiow – Privacy Department</strong>
<br /><strong><a href="mailto:contact@sapiow.com">contact@sapiow.com</a></strong>
<br /><a href="https://sapiow-jfmsga3sp-betech-projects.vercel.app/mentions-legales">https://sapiow-jfmsga3sp-betech-projects.vercel.app/mentions-legales</a></p>`,
    licensesContent:
      "Sapiow uses several open source software components for its operation. We are grateful to the open source community for their remarkable work. Our application is built with Next.js under the MIT license, React under the MIT license, and uses several libraries such as TailwindCSS, React Query, and next-international for translation management. All these libraries are used in accordance with their respective licenses. The complete licenses for these software components are available in our code repository or upon request. We are committed to respecting the terms of open source licenses and contributing to the open source community when possible. If you are a developer and would like to contribute to Sapiow, please don't hesitate to contact us. We believe in the power of collaboration and knowledge sharing to create quality products.",
  },

  // About Page
  about: {
    logoAlt: "Sapiow Logo",
    copyright: "© 2025 Sapiow. All rights reserved.",
    contactUs: "Contact Us",
    visitWebsite: "Visit Website",
  },

  // Support Page
  support: {
    title: "How can we help you?",
    searchPlaceholder: "Enter your keyword",
    noResultsFound: "No results found for",
    // FAQ Data
    faq: {
      question1: "How to create an account?",
      answer1:
        "Open the Tradebase app to get started and follow the steps. Tradebase does not charge fees to create or maintain your Tradebase account.",
      question2: "How to add a payment method via this application?",
      answer2:
        "To add a payment method, go to your account settings, select 'Payment Methods' and follow the instructions to add your bank card or PayPal account.",
      question3: "Question 3",
      answer3:
        "Answer to question 3. You can add here all relevant information to help your users.",
      question4: "Question 4",
      answer4:
        "Answer to question 4. This section can contain technical details or step-by-step instructions.",
    },
  },

  // Language Page
  languagePage: {
    french: "French",
    english: "English",
    errorChangingLanguage: "Error changing language:",
    flagAlt: "Flag",
  },

  // Bank Account Section
  bankAccount: {
    title: "Your Bank Account",
    bankAlt: "Bank",
    addRib: "Add your bank details",
    add: "Add",
    modify: "Modify",
    completeConfig: "Complete configuration",
    incompleteConfig: "Incomplete configuration",
    bankUpdateError: "Error updating bank account",
    inProgress: "In progress...",
    preparingRedirect: "Preparing redirect...",
    // Add Bank Account Modal
    addBankAccount: "Add a bank account",
    nameMatchId:
      "Make sure this matches the name on your government-issued ID.",
    iban: "IBAN",
    bicSwift: "BIC/SWIFT Code",
  },

  // Revenue Page
  revenue: {
    totalEarnings: "Total Earnings",
    // Filters
    thisMonth: "This Month",
    thisQuarter: "This Quarter",
    custom: "Custom",
    selectCustomPeriod: "Select a custom period",
    selectedPeriod: "Selected period:",
    from: "From",
    to: "to",
    // Transactions
    lastTransfer: "Last Transfer",
    nextTransfer: "Next Transfer",
    // Payment Status
    paid: "Paid",
    pending: "Pending",
    // Calendar
    calendarAlt: "Calendar",
    // Payment History
    noPaymentHistory:
      "No payment history available. Set up your payment account to start receiving revenue.",
    errorLoadingPayments: "Error loading payments",
    noPaymentsFound: "No payments found",
    unknownSession: "Unknown session",
    locale: "en",
  },

  // Offers Page
  offers: {
    // Offer Types
    videoSessions: "Video Sessions",
    monthlyAccompaniment: "Monthly Accompaniment",
    // Features
    oneOnOne: "1:1 Individual Session",
    videoCall: "Video Call",
    strategicSession: "Strategic Session",
    exclusiveResources: "Exclusive Resources",
    support: "Client Support",
    mentorship: "Mentorship",
    webinar: "Webinar",
    // Interface
    selectOfferToSeeDetails: "Select an offer to see details",
    noOffersConfigured: "No offers configured",
    whatIsIncluded: "What's included",
    perMonth: "/ Month",
    // Actions
    delete: "Delete",
    deleting: "Deleting...",
    addOffer: "Add an offer",
    createAccompaniment: "Create accompaniment",
    // Empty States
    noMonthlyAccompaniment: "No monthly accompaniment configured yet.",
    createFirstOffer: "Create your first accompaniment offer for your clients.",
    // Default Names
    monthlyAccompanimentDefault: "Monthly Accompaniment",
    // Add/Edit Session Modal
    addSession: "Add a session",
    editSession: "Edit session",
    sessionName: "Session name",
    sessionNamePlaceholder: "Ex: Strategic consultation",
    price: "Price (€)",
    pricePlaceholder: "Ex: 120",
    euroAlt: "Euro",
    includedFeatures: "Included features",
    addFeaturePlaceholder: "Ex: Priority support, Exclusive resources...",
    add: "Add",
    adding: "Adding...",
    deleteFeature: "Delete this feature",
    loadingFeatures: "Loading features...",
    noFeaturesYet: "No features added yet. Add one above.",
    createSessionFirst: "Create the session first to add features.",
    sessionCreatedAddFeatures:
      "✅ Session created! You can now add features below.",
    creating: "Creating...",
    editing: "Editing...",
    // Offer Selection
    chooseOffer: "Choose an offer",
    singleSessions: "Single sessions",
    quickVideoSession: "Quick video session",
    perfectForSpecificQuestions: "Perfect for specific questions",
    startingFrom: "Starting from",
    viewTimeSlots: "View time slots",
    noSlotsAvailable: "No slots available",
    monthlySubscriptions: "Monthly subscriptions",
    chooseAndPay: "Choose and pay",
    creatingAppointment: "In progress...",
    // Features
    oneOnOneChat: "1:1 Chat",
    oneOnOneVideoCalls: "1:1 Video calls",
    personalizedSupport: "Personalized support",
    strategySessions: "Strategy sessions",
  },

  // Expert Details Page
  expertDetails: {
    // Error States
    errorLoadingExpert: "Error loading expert",
    expertNotFound: "Expert not found",
    // Expert Info
    about: "About",
    seeMore: "See more",
    seeLess: "See less",
    expertiseDomains: "Expertise domains",
    revenueDestination: "All revenue will be donated to",
    foundations: "760 foundations.",
    // Questions & Expectations
    questionsToAsk: "Questions to ask",
    expectations: "Expectations",
    visio15min: "15min Video",
    // Sample Questions
    question1:
      "I'm thinking of starting a business. What are the next things I should focus on?",
    question2: "How do I know if my business idea will work?",
    question3: "How do you approach growing my business?",
    question4:
      "What key metrics should I aim for at different stages to be a leading company?",
    // Expectations
    expectation1: "Ask three or more questions",
    expectation2: "Tips for starting a successful business",
    expectation3: "Tips for getting your first 10,000 customers",
    expectation4: "Growth tips and growth kickstart",
    // How it works
    howItWorks: "How it works?",
    findExpert: "Find an expert",
    findExpertDesc:
      "Discover and choose from our list of the world's most sought-after experts",
    bookOrSubscribe: "Book or subscribe",
    bookOrSubscribeDesc:
      "Book a one-time video call or choose a plan for continuous access to your expert",
    virtualConsultation: "Virtual consultation",
    virtualConsultationDesc:
      "Join the video call or chat, ask questions and get expert advice",
    // Similar Experts
    similarExperts: "Similar experts",
    seeAll: "See all",
    // FAQ
    frequentQuestions: "Frequently asked questions",
    whatIsSapiow: "What is Sapiow?",
    whatIsSapiowAnswer:
      "Sapiow is an online platform that allows you to book experts for video consultations, offering users direct access to qualified professionals in various fields.",
    benefitsQuestion: "What are the benefits of using Sapiow for users?",
    benefitsAnswer:
      "Sapiow offers direct access to qualified experts, flexible consultations, and a secure platform to get professional advice in many fields.",
    expertsTypesQuestion: "What types of experts can I book on Sapiow?",
    expertsTypesAnswer:
      "You can book experts in many fields: business, health, technology, personal development, and many other specialties.",
    qualityQuestion:
      "How does Sapiow guarantee the quality of available experts?",
    qualityAnswer:
      "All our experts are verified and selected according to strict criteria of expertise, experience and professional qualifications.",
    feesQuestion: "What are the fees associated with using Sapiow?",
    feesAnswer:
      "Rates vary by expert and type of consultation. You can choose between single sessions or monthly subscriptions.",
    // Success Page
    congratulations: "Congratulations!",
    sessionBookedSuccess: "Your session has been successfully booked!",
    addToCalendar: "Add to calendar",
  },
  // Session Detail Sheet
  sessionDetail: {
    title: "Details",
    startVideo: "Start video call",
    sendMessage: "Send message",
    askQuestion: "Ask a question",
    questionsAndAnswers: "Questions and answers",
    noQuestions: "No questions asked yet",
    noQuestionsDescription: "Ask your first question to the expert",
    writeQuestion: "Write your question...",
    send: "Send",
    cancel: "Cancel",
    questionSubmitError: "Error submitting question",
    cancelAppointment: "Cancel appointment",
    confirmCancel: "Are you sure you want to cancel this appointment?",
    cancelWarning: "This action cannot be undone.",
    confirmCancelButton: "Confirm cancellation",
    cancelling: "Cancelling...",
    cancelSuccess: "Appointment cancelled successfully",
    cancelError: "Error cancelling appointment",
    dateNotAvailable: "Date not available",
    timeNotAvailable: "Time not available",
    session: "Session",
    expert: "Expert",
    quickVideoSession: "Quick video session",
    bookSession: "Book a session",
    // Alt texts
    congratulationAlt: "Congratulations",
    magnifierAlt: "Magnifier",
    calendarAlt: "Calendar",
    videoCameraAlt: "Video camera",
    // Questions section
    dontHesitateAskQuestions:
      "Don't hesitate to ask your questions before the session",
    submitQuestionsAdvance:
      "You have the possibility to submit your questions in advance so that the expert can better prepare for you.",
    submitMyQuestions: "Submit my questions",
    typeQuestionHere: "Type your question here...",
    addAnotherQuestion: "Add another question",
    questionsOrComments: "Questions or comments",
    viewDetails: "View details",
    consultationWith: "Consultation with",
    videoConsultation: "Video consultation with",
    // Edit/Delete questions
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    confirmDeleteQuestion: "Are you sure you want to delete this question?",
    questionUpdateError: "Error updating question",
    questionDeleteError: "Error deleting question",
  },

  // Dark Session Card / Upcoming Video Call
  upcomingCall: {
    now: "Now",
    inDays: "In",
    day: "day",
    days: "days",
    inHours: "In",
    hours: "h",
    inMinutes: "In",
    minutes: "min",
    calendarAlt: "Calendar",
    clockAlt: "Clock",
  },

  // Video Call
  videoCall: {
    callEnded: "Call ended",
    error: "Connection error",
    loading: "Connecting...",
    mute: "Mute",
    unmute: "Unmute",
    camera: "Camera",
    endCall: "End call",
  },

  // Categories
  categories: {
    media: "Media",
    culture: "Culture",
    business: "Business",
    maison: "Home",
    artisanat: "Crafts",
    glow: "Wellness",
    sport: "Sports",
    specializedIn: "specialized in",
  },

  // Calendar
  calendar: {
    // Default values
    defaultClient: "Client",
    defaultDuration: "30 min",
    defaultConsultation: "Consultation",
    // Days of week (array format)
    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    // Days of week (individual)
    sunday: "Sun",
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    // Months (array format)
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    // Months (individual)
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
    // Status
    blocked: "Blocked",
    // Planning
    planYourVisio: "Plan your video call",
    visioDuration: "Video call duration",
    availableSlots: "Available slots",
    noSlotsAvailable: "No slots available for this day.",
    selectAnotherDate: "Please select another date.",
    complete: "Full",
    // Booking
    minutes: "minutes",
    reserving: "Booking...",
    reserve: "Book",
    reservationError: "Booking error. Please try again.",
  },

  // Payment
  payment: {
    success: "Payment successful!",
    processing: "Processing payment...",
    failed: "Payment failed",
    redirecting: "Redirecting...",
  },

  // Home Pages
  home: {
    // Expert Dashboard
    hello: "Hello",
    user: "User",
    visiosToday: "video call coming up today",
    visiosTodayPlural: "video calls coming up today",
    youHave: "You have",
    completedVisios: "Completed video calls",
    earningsSummary: "Earnings summary",
    pendingRequests: "Pending requests",
    seeAll: "See all",
    noPendingRequests: "No pending requests",
    nextVisio: "Next video call",
    noScheduledVisio: "No scheduled video calls",
    // Client Dashboard
    loadingExperts: "Loading experts...",
    errorLoadingExperts: "Error loading experts",
    unknownError: "Unknown error",
    yourNextVisio: "Your next video call",
    accelerateProject: "Accelerate your project, Book a Video Call.",
  },

  // Share Link Button
  shareLink: {
    defaultText: "Share your booking link",
    copied: "Link copied!",
    copyError: "Error copying link",
  },

  // Header
  header: {
    profileAlt: "Profile picture",
    expertMode: "Expert mode",
    notifications: "Notifications",
    unreadSingular: "unread",
    unreadPlural: "unread",
    noNotifications: "No notifications",
    seeAllNotifications: "See all notifications",
    markAsReadError: "Error marking notification as read",
    // Time formatting
    justNow: "Just now",
    minutesAgo: "",
    hoursAgo: "",
    minutes: "min ago",
    hours: "h ago",
  },

  // Header Client
  headerClient: {
    search: "Search",
    searchPlaceholder: "Search",
    searchAlt: "search",
    heartAlt: "heart",
    clientMode: "Client mode",
    becomeExpert: "Become an expert",
  },

  // Favorites Page
  favorites: {
    title: "My Favorites",
    loading: "Loading your favorites...",
    error: "Error loading favorites",
    unknownError: "Unknown error",
    noFavorites: "No professionals in favorites yet",
    noFavoritesDescription:
      "Add professionals to your favorites by clicking the heart",
  },

  // Payment History Page
  paymentHistory: {
    title: "Payment History",
    loading: "Loading history...",
    searchPlaceholder: "Amount, transaction ...",
    filterBy: "Filter by",
    allTransactions: "All transactions",
    completed: "Completed",
    pending: "Pending",
    failed: "Failed",
    transactionDetails: "Transaction Details",
    backToList: "Back to list",
    amount: "Amount",
    expert: "Expert",
    session: "Session",
    dateTime: "Date and time",
    status: "Status",
    transactionId: "Transaction ID",
    noTransactions: "No transactions found",
    noTransactionsDescription:
      "Your transactions will appear here once completed",
    selectTransaction: "Select a transaction to view details",
    sendInvoice: "Send invoice",
    cancelled: "Cancelled",
    paymentConsultationWith: "Payment consultation with",
  },

  // Phone Number Component
  phoneNumber: {
    label: "Phone number",
    placeholder: "06 06 06 06 06",
    searchCountry: "Search country...",
    noCountryFound: "No country found",
    invalidNumber: "Invalid phone number",
    required: "This field is required",
  },

  // Search Components
  search: {
    placeholder: "Search",
    searchPlaceholder: "Search",
    noResults: "No results found",
    searching: "Searching...",
  },

  // Page Header & Notifications
  pageHeader: {
    notifications: "Notifications",
    markAsRead: "Mark as read",
    markAllAsRead: "Mark all as read",
    noNotifications: "No notifications",
    seeAllNotifications: "See all notifications",
    justNow: "Just now",
    minutesAgo: "",
    hoursAgo: "",
    minutes: "min ago",
    hours: "h ago",
    notificationError: "Error marking notification as read",
  },

  // Session Details Panel
  sessionDetailsPanel: {
    noSessionToday: "No sessions are scheduled for today.",
    addAvailability: "Add availability",
    selectDateToView: "Select a date to view details.",
    client: "Client",
    consultation: "Consultation",
  },

  // Toast Messages
  toast: {
    // Questions
    questionSubmitted: "Question submitted successfully!",
    questionUpdated: "Question updated successfully!",
    questionSubmitError: "Error submitting question",
    questionUpdateError: "Error updating question",

    // Appointments
    appointmentCreated: "Appointment created successfully!",
    appointmentConfirmed: "Appointment confirmed successfully!",
    appointmentCancelled: "Appointment cancelled successfully!",
    appointmentCreateError: "Error creating appointment",
    appointmentUpdateError: "Error updating appointment",
    appointmentCancelError: "Error cancelling appointment",

    // Date Blocking
    dateBlocked: "Date blocked successfully!",
    dateBlockError: "Error blocking date",
    dateUnblocked: "Date unblocked successfully!",
    dateUnblockError: "Error unblocking date",

    // Allow Days (Availability Periods)
    allowDayCreated: "Availability period created successfully!",
    allowDayUpdated: "Availability period updated successfully!",
    allowDayDeleted: "Availability period deleted successfully!",
    allowDayCreateError: "Error creating availability period",
    allowDayUpdateError: "Error updating availability period",
    allowDayDeleteError: "Error deleting availability period",

    // Session Features
    sessionFeatureCreated: "Feature created successfully!",
    sessionFeatureUpdated: "Feature updated successfully!",
    sessionFeatureDeleted: "Feature deleted successfully!",
    sessionFeatureCreateError: "Error creating feature",
    sessionFeatureUpdateError: "Error updating feature",
    sessionFeatureDeleteError: "Error deleting feature",

    // Video Call
    callConnectionError: "Error connecting to video call",
    callTokenError: "Error retrieving call token",
  },

  // Countries
  countries: {
    // Africa
    DZ: "Algeria",
    AO: "Angola",
    BJ: "Benin",
    BW: "Botswana",
    BF: "Burkina Faso",
    BI: "Burundi",
    CV: "Cape Verde",
    CM: "Cameroon",
    CF: "Central African Republic",
    TD: "Chad",
    KM: "Comoros",
    CG: "Congo",
    CD: "Democratic Republic of the Congo",
    CI: "Ivory Coast",
    DJ: "Djibouti",
    EG: "Egypt",
    GQ: "Equatorial Guinea",
    ER: "Eritrea",
    ET: "Ethiopia",
    GA: "Gabon",
    GM: "Gambia",
    GH: "Ghana",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    KE: "Kenya",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libya",
    MG: "Madagascar",
    MW: "Malawi",
    ML: "Mali",
    MR: "Mauritania",
    MU: "Mauritius",
    MA: "Morocco",
    MZ: "Mozambique",
    NA: "Namibia",
    NE: "Niger",
    NG: "Nigeria",
    RW: "Rwanda",
    ST: "Sao Tome and Principe",
    SN: "Senegal",
    SC: "Seychelles",
    SL: "Sierra Leone",
    SO: "Somalia",
    ZA: "South Africa",
    SS: "South Sudan",
    SD: "Sudan",
    SZ: "Eswatini",
    TZ: "Tanzania",
    TG: "Togo",
    TN: "Tunisia",
    UG: "Uganda",
    ZM: "Zambia",
    ZW: "Zimbabwe",
    // Europe
    AD: "Andorra",
    AL: "Albania",
    AT: "Austria",
    BY: "Belarus",
    BE: "Belgium",
    BA: "Bosnia and Herzegovina",
    BG: "Bulgaria",
    HR: "Croatia",
    CY: "Cyprus",
    CZ: "Czech Republic",
    DK: "Denmark",
    EE: "Estonia",
    FI: "Finland",
    FR: "France",
    DE: "Germany",
    GR: "Greece",
    HU: "Hungary",
    IS: "Iceland",
    IE: "Ireland",
    IT: "Italy",
    LV: "Latvia",
    LI: "Liechtenstein",
    LT: "Lithuania",
    LU: "Luxembourg",
    MT: "Malta",
    MD: "Moldova",
    MC: "Monaco",
    ME: "Montenegro",
    NL: "Netherlands",
    MK: "North Macedonia",
    NO: "Norway",
    PL: "Poland",
    PT: "Portugal",
    RO: "Romania",
    RU: "Russia",
    SM: "San Marino",
    RS: "Serbia",
    SK: "Slovakia",
    SI: "Slovenia",
    ES: "Spain",
    SE: "Sweden",
    CH: "Switzerland",
    UA: "Ukraine",
    GB: "United Kingdom",
    VA: "Vatican City",
    // Asia
    AF: "Afghanistan",
    AM: "Armenia",
    AZ: "Azerbaijan",
    BH: "Bahrain",
    BD: "Bangladesh",
    BT: "Bhutan",
    BN: "Brunei",
    KH: "Cambodia",
    CN: "China",
    GE: "Georgia",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran",
    IQ: "Iraq",
    IL: "Israel",
    JP: "Japan",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Laos",
    LB: "Lebanon",
    MY: "Malaysia",
    MV: "Maldives",
    MN: "Mongolia",
    MM: "Myanmar",
    NP: "Nepal",
    KP: "North Korea",
    OM: "Oman",
    PK: "Pakistan",
    PS: "Palestine",
    PH: "Philippines",
    QA: "Qatar",
    SA: "Saudi Arabia",
    SG: "Singapore",
    KR: "South Korea",
    LK: "Sri Lanka",
    SY: "Syria",
    TW: "Taiwan",
    TJ: "Tajikistan",
    TH: "Thailand",
    TL: "East Timor",
    TR: "Turkey",
    TM: "Turkmenistan",
    AE: "United Arab Emirates",
    UZ: "Uzbekistan",
    VN: "Vietnam",
    YE: "Yemen",
    // North America
    CA: "Canada",
    MX: "Mexico",
    US: "United States",
    // Central America
    BZ: "Belize",
    CR: "Costa Rica",
    SV: "El Salvador",
    GT: "Guatemala",
    HN: "Honduras",
    NI: "Nicaragua",
    PA: "Panama",
    // South America
    AR: "Argentina",
    BO: "Bolivia",
    BR: "Brazil",
    CL: "Chile",
    CO: "Colombia",
    EC: "Ecuador",
    FK: "Falkland Islands",
    GF: "French Guiana",
    GY: "Guyana",
    PY: "Paraguay",
    PE: "Peru",
    SR: "Suriname",
    UY: "Uruguay",
    VE: "Venezuela",
    // Caribbean
    AG: "Antigua and Barbuda",
    BS: "Bahamas",
    BB: "Barbados",
    CU: "Cuba",
    DM: "Dominica",
    DO: "Dominican Republic",
    GD: "Grenada",
    HT: "Haiti",
    JM: "Jamaica",
    KN: "Saint Kitts and Nevis",
    LC: "Saint Lucia",
    VC: "Saint Vincent and the Grenadines",
    TT: "Trinidad and Tobago",
    // Oceania
    AU: "Australia",
    FJ: "Fiji",
    KI: "Kiribati",
    MH: "Marshall Islands",
    FM: "Micronesia",
    NR: "Nauru",
    NZ: "New Zealand",
    PW: "Palau",
    PG: "Papua New Guinea",
    WS: "Samoa",
    SB: "Solomon Islands",
    TO: "Tonga",
    TV: "Tuvalu",
    VU: "Vanuatu",
  },
} as const;
