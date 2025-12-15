const translations = {
  en: {
    logo: '7rayfi',
    hero: {
      title: 'Find or Offer Professional Services',
      subtitle: 'Connect with skilled professionals or showcase your expertise',
      question: 'What brings you here?',
      findService: 'Find a Service',
      offerService: 'Offer a Service',
      getStarted: 'Get Started',
    },
    stats: {
      professionals: 'Professionals',
      services: 'Services Completed',
      satisfaction: 'Satisfaction Rate',
      support: 'Support Available',
    },
    howItWorks: {
      title: 'How It Works',
      findPath: {
        title: 'Looking for a Service',
        step1: {
          title: 'Search & Browse',
          description: 'Find professionals by category, location, or expertise',
        },
        step2: {
          title: 'Review & Connect',
          description: 'Check ratings, reviews, and contact the right professional',
        },
        step3: {
          title: 'Get It Done',
          description: 'Work with confidence and leave a review after completion',
        },
      },
      offerPath: {
        title: 'Offering a Service',
        step1: {
          title: 'Create Profile',
          description: 'Set up your professional profile with skills and portfolio',
        },
        step2: {
          title: 'Get Discovered',
          description: 'Be visible to thousands of potential clients in your area',
        },
        step3: {
          title: 'Grow Business',
          description: 'Build reputation through reviews and expand your client base',
        },
      },
    },
    testimonials: {
      title: 'What Our Users Say',
      items: [
        {
          text: 'Found an excellent plumber within minutes. The service was fast and professional. Highly recommend!',
          name: 'Sarah M.',
          role: 'Homeowner',
        },
        {
          text: 'As a freelancer, this platform helped me grow my client base by 300% in 6 months!',
          name: 'Karim B.',
          role: 'Graphic Designer',
        },
        {
          text: "The rating system helps me trust the professionals. I've never been disappointed!",
          name: 'Amina L.',
          role: 'Business Owner',
        },
      ],
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How do I get started?',
          answer:
            'Simply choose whether you want to find or offer a service, create an account, and start exploring. It takes less than 2 minutes to get started!',
        },
        {
          question: 'Is the service free?',
          answer:
            'Creating an account and browsing services is completely free. We only charge a small service fee on completed transactions to maintain the platform.',
        },
        {
          question: 'How are professionals verified?',
          answer:
            'All professionals go through a verification process including ID verification, skill assessment, and background checks. We also maintain a review system for transparency.',
        },
        {
          question: "What if I'm not satisfied?",
          answer:
            "We offer a satisfaction guarantee. If you're not happy with a service, contact our support team within 48 hours, and we'll work to resolve the issue or provide a refund.",
        },
        {
          question: 'Can I offer multiple services?',
          answer:
            "Yes! You can list as many services as you'd like on your professional profile. This helps you reach more clients across different categories.",
        },
      ],
    },
    contact: {
      title: 'Get in Touch',
      description:
        "Have questions or need assistance? We're here to help. Reach out to our support team anytime.",
      form: {
        name: 'Your Name',
        email: 'Email Address',
        message: 'Message',
        submit: 'Send Message',
      },
    },
    signup: {
      title: 'Artisan Registration',
      subtitle: 'Create your profile in 4 steps.',
      steps: {
        identity: 'Identity',
        profession: 'Profession',
        presentation: 'Presentation',
        account: 'Account',
      },
      panels: {
        identity: { title: 'Identity' },
        profession: { title: 'Profession' },
        presentation: { title: 'Presentation' },
        account: { title: 'Account' },
      },
      fields: {
        firstName: { label: 'First name', placeholder: 'Ahmed' },
        lastName: { label: 'Last name', placeholder: 'Benali' },
        email: { label: 'Email', placeholder: 'ahmed@example.com' },
        phone: { label: 'Phone', placeholder: '+2126XXXXXXXX' },
        profession: { label: 'Profession', placeholder: 'Plumber' },
        category: { label: 'Category', placeholder: 'Select a category' },
        skills: {
          label: 'Skills',
          placeholder: 'Repair, Installation, Emergency',
          help: 'Separate skills with commas.',
        },
        city: { label: 'Primary city', placeholder: 'Casablanca' },
        serviceAreas: {
          label: 'Service areas',
          placeholder: 'Casablanca, Mohammedia',
          help: 'List the cities where you can work.',
        },
        bio: { label: 'Bio', placeholder: 'Tell clients about your experience...' },
        portfolioLinks: {
          label: 'Portfolio links',
          placeholder: 'https://example.com/project-1\nhttps://example.com/project-2',
          help: 'One link per line (optional).',
        },
        hourlyRate: { label: 'Hourly rate (MAD)', placeholder: '250' },
        pricingNote: {
          label: 'Pricing note',
          placeholder: 'Minimum 2 hours',
          help: 'Optional note shown to clients.',
        },
        username: { label: 'Username', placeholder: 'ahmed.plumber' },
        password: { label: 'Password', placeholder: '••••••••' },
        confirmPassword: { label: 'Confirm password', placeholder: '••••••••' },
      },
      sms: {
        title: 'SMS Verification',
        subtitle: 'We will send a 6-digit code to verify your number.',
        send: 'Send code',
        sent: 'Code sent.',
        verified: 'Phone verified.',
        mockHint: 'Mock SMS to {phone}: your code is {code}',
        noCodeYet: 'No code sent yet.',
        code: { label: 'Verification code', placeholder: '123456' },
        errors: {
          enterPhone: 'Enter your phone number first.',
          invalidPhone: 'Enter a valid Moroccan phone number.',
          sendFirst: 'Send a code first.',
          invalidCodeFormat: 'Enter a 6-digit code.',
          wrongCode: 'Wrong code. Try again.',
        },
      },
      errors: {
        required: 'This field is required.',
        min2: 'Must be at least 2 characters.',
        min3: 'Must be at least 3 characters.',
        minOne: 'Add at least one item.',
        invalidEmail: 'Enter a valid email address.',
        invalidPhone: 'Enter a valid Moroccan phone number.',
        positiveNumber: 'Enter a positive number.',
        invalidUrl: 'Enter a valid URL.',
        passwordMin6: 'Password must be at least 6 characters.',
        passwordMismatch: "Passwords don't match.",
        smsNotVerified: 'Please verify your phone number.',
        fixBeforeSubmit: 'Please fix the errors before submitting.',
      },
      status: {
        submitting: 'Submitting...',
        submitSuccess: 'Registration submitted successfully.',
        submitError: 'Could not submit registration.',
        networkError: 'Network error. Please try again.',
        categoriesFallback: 'Could not load categories. Showing fallback list.',
      },
      actions: {
        back: 'Back',
        next: 'Next',
        submit: 'Create account',
      },
      submitNote: 'By submitting, you will create your artisan profile.',
    },
    footer: {
      about: {
        title: 'About 7rayfi',
        text: 'Connecting professionals with clients across various services.',
      },
      links: {
        title: 'Quick Links',
        about: 'About Us',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
      },
      support: {
        title: 'Support',
        help: 'Help Center',
        contact: 'Contact Us',
        faq: 'FAQ',
      },
      copyright: '© 2024 7rayfi. All rights reserved.',
    },
  },
  fr: {
    logo: '7rayfi',
    hero: {
      title: 'Trouvez ou Offrez des Services Professionnels',
      subtitle:
        'Connectez-vous avec des professionnels qualifiés ou mettez en valeur votre expertise',
      question: 'Que recherchez-vous?',
      findService: 'Trouver un Service',
      offerService: 'Offrir un Service',
      getStarted: 'Commencer',
    },
    stats: {
      professionals: 'Professionnels',
      services: 'Services Complétés',
      satisfaction: 'Taux de Satisfaction',
      support: 'Support Disponible',
    },
    howItWorks: {
      title: 'Comment Ça Marche',
      findPath: {
        title: 'Recherche de Service',
        step1: {
          title: 'Rechercher & Parcourir',
          description: 'Trouvez des professionnels par catégorie, lieu ou expertise',
        },
        step2: {
          title: 'Évaluer & Connecter',
          description: 'Vérifiez les notes, avis et contactez le bon professionnel',
        },
        step3: {
          title: 'Réalisez-le',
          description: 'Travaillez en toute confiance et laissez un avis après achèvement',
        },
      },
      offerPath: {
        title: 'Offre de Service',
        step1: {
          title: 'Créer un Profil',
          description: 'Configurez votre profil professionnel avec compétences et portfolio',
        },
        step2: {
          title: 'Être Découvert',
          description: 'Soyez visible par des milliers de clients potentiels dans votre région',
        },
        step3: {
          title: 'Développer Affaires',
          description: 'Construisez votre réputation grâce aux avis et élargissez votre clientèle',
        },
      },
    },
    testimonials: {
      title: 'Ce que Disent Nos Utilisateurs',
      items: [
        {
          text: 'Trouvé un excellent plombier en quelques minutes. Le service était rapide et professionnel. Je recommande vivement!',
          name: 'Sarah M.',
          role: 'Propriétaire',
        },
        {
          text: "En tant que freelance, cette plateforme m'a aidé à augmenter ma clientèle de 300% en 6 mois!",
          name: 'Karim B.',
          role: 'Designer Graphique',
        },
        {
          text: "Le système de notation m'aide à faire confiance aux professionnels. Je n'ai jamais été déçu!",
          name: 'Amina L.',
          role: "Propriétaire d'Entreprise",
        },
      ],
    },
    faq: {
      title: 'Questions Fréquentes',
      items: [
        {
          question: 'Comment puis-je commencer?',
          answer:
            'Choisissez simplement si vous voulez trouver ou offrir un service, créez un compte et commencez à explorer. Cela prend moins de 2 minutes!',
        },
        {
          question: 'Le service est-il gratuit?',
          answer:
            "La création d'un compte et la navigation sont entièrement gratuites. Nous facturons seulement une petite commission sur les transactions complétées pour maintenir la plateforme.",
        },
        {
          question: 'Comment les professionnels sont-ils vérifiés?',
          answer:
            "Tous les professionnels passent par un processus de vérification incluant la vérification d'identité, l'évaluation des compétences et des vérifications d'antécédents. Nous maintenons également un système d'avis pour la transparence.",
        },
        {
          question: 'Et si je ne suis pas satisfait?',
          answer:
            "Nous offrons une garantie de satisfaction. Si vous n'êtes pas satisfait d'un service, contactez notre équipe de support dans les 48 heures, et nous travaillerons pour résoudre le problème ou fournir un remboursement.",
        },
        {
          question: 'Puis-je offrir plusieurs services?',
          answer:
            'Oui! Vous pouvez lister autant de services que vous le souhaitez sur votre profil professionnel. Cela vous aide à atteindre plus de clients dans différentes catégories.',
        },
      ],
    },
    contact: {
      title: 'Contactez-nous',
      description:
        "Vous avez des questions ou besoin d'aide? Nous sommes là pour vous aider. Contactez notre équipe de support à tout moment.",
      form: {
        name: 'Votre Nom',
        email: 'Adresse Email',
        message: 'Message',
        submit: 'Envoyer le Message',
      },
    },
    signup: {
      title: 'Inscription Artisan',
      subtitle: 'Créez votre profil en 4 étapes.',
      steps: {
        identity: 'Identité',
        profession: 'Profession',
        presentation: 'Présentation',
        account: 'Compte',
      },
      panels: {
        identity: { title: 'Identité' },
        profession: { title: 'Profession' },
        presentation: { title: 'Présentation' },
        account: { title: 'Compte' },
      },
      fields: {
        firstName: { label: 'Prénom', placeholder: 'Ahmed' },
        lastName: { label: 'Nom', placeholder: 'Benali' },
        email: { label: 'Email', placeholder: 'ahmed@example.com' },
        phone: { label: 'Téléphone', placeholder: '+2126XXXXXXXX' },
        profession: { label: 'Profession', placeholder: 'Plombier' },
        category: { label: 'Catégorie', placeholder: 'Sélectionner une catégorie' },
        skills: {
          label: 'Compétences',
          placeholder: 'Réparation, Installation, Urgence',
          help: 'Séparez les compétences par des virgules.',
        },
        city: { label: 'Ville principale', placeholder: 'Casablanca' },
        serviceAreas: {
          label: 'Zones de service',
          placeholder: 'Casablanca, Mohammedia',
          help: 'Listez les villes où vous pouvez intervenir.',
        },
        bio: { label: 'Présentation', placeholder: 'Parlez de votre expérience...' },
        portfolioLinks: {
          label: 'Liens portfolio',
          placeholder: 'https://example.com/projet-1\nhttps://example.com/projet-2',
          help: 'Un lien par ligne (optionnel).',
        },
        hourlyRate: { label: 'Tarif horaire (MAD)', placeholder: '250' },
        pricingNote: {
          label: 'Note de prix',
          placeholder: 'Minimum 2 heures',
          help: 'Note optionnelle affichée aux clients.',
        },
        username: { label: "Nom d'utilisateur", placeholder: 'ahmed.plombier' },
        password: { label: 'Mot de passe', placeholder: '••••••••' },
        confirmPassword: { label: 'Confirmer le mot de passe', placeholder: '••••••••' },
      },
      sms: {
        title: 'Vérification SMS',
        subtitle: 'Nous enverrons un code à 6 chiffres pour vérifier votre numéro.',
        send: 'Envoyer le code',
        sent: 'Code envoyé.',
        verified: 'Téléphone vérifié.',
        mockHint: 'SMS simulé vers {phone} : votre code est {code}',
        noCodeYet: "Aucun code envoyé pour le moment.",
        code: { label: 'Code de vérification', placeholder: '123456' },
        errors: {
          enterPhone: 'Saisissez d\'abord votre numéro de téléphone.',
          invalidPhone: 'Saisissez un numéro marocain valide.',
          sendFirst: 'Envoyez d\'abord un code.',
          invalidCodeFormat: 'Saisissez un code à 6 chiffres.',
          wrongCode: 'Code incorrect. Réessayez.',
        },
      },
      errors: {
        required: 'Champ requis.',
        min2: 'Au moins 2 caractères.',
        min3: 'Au moins 3 caractères.',
        minOne: 'Ajoutez au moins un élément.',
        invalidEmail: 'Veuillez saisir une adresse email valide.',
        invalidPhone: 'Veuillez saisir un numéro de téléphone marocain valide.',
        positiveNumber: 'Veuillez saisir un nombre positif.',
        invalidUrl: 'Veuillez saisir une URL valide.',
        passwordMin6: 'Le mot de passe doit contenir au moins 6 caractères.',
        passwordMismatch: 'Les mots de passe ne correspondent pas.',
        smsNotVerified: 'Veuillez vérifier votre numéro de téléphone.',
        fixBeforeSubmit: 'Veuillez corriger les erreurs avant de soumettre.',
      },
      status: {
        submitting: 'Envoi en cours...',
        submitSuccess: 'Inscription envoyée avec succès.',
        submitError: "Impossible d'envoyer l'inscription.",
        networkError: 'Erreur réseau. Veuillez réessayer.',
        categoriesFallback: 'Impossible de charger les catégories. Liste de secours affichée.',
      },
      actions: {
        back: 'Retour',
        next: 'Suivant',
        submit: 'Créer le compte',
      },
      submitNote: 'En soumettant, vous créerez votre profil artisan.',
    },
    footer: {
      about: {
        title: 'À Propos de 7rayfi',
        text: 'Connecter les professionnels avec les clients à travers divers services.',
      },
      links: {
        title: 'Liens Rapides',
        about: 'À Propos',
        terms: 'Conditions de Service',
        privacy: 'Politique de Confidentialité',
      },
      support: {
        title: 'Support',
        help: "Centre d'Aide",
        contact: 'Contactez-nous',
        faq: 'FAQ',
      },
      copyright: '© 2024 7rayfi. Tous droits réservés.',
    },
  },
  ar: {
    logo: '7رايفي',
    hero: {
      title: 'ابحث عن خدمات احترافية أو قدمها',
      subtitle: 'تواصل مع محترفين مهرة أو أظهر خبرتك',
      question: 'ما الذي أتى بك إلى هنا؟',
      findService: 'البحث عن خدمة',
      offerService: 'تقديم خدمة',
      getStarted: 'ابدأ الآن',
    },
    stats: {
      professionals: 'محترفون',
      services: 'خدمات مكتملة',
      satisfaction: 'معدل الرضا',
      support: 'الدعم متاح',
    },
    howItWorks: {
      title: 'كيف يعمل',
      findPath: {
        title: 'البحث عن خدمة',
        step1: {
          title: 'البحث والتصفح',
          description: 'اعثر على محترفين حسب الفئة أو الموقع أو الخبرة',
        },
        step2: {
          title: 'المراجعة والتواصل',
          description: 'تحقق من التقييمات والمراجعات واتصل بالمحترف المناسب',
        },
        step3: {
          title: 'إنجاز العمل',
          description: 'اعمل بثقة واترك تقييمًا بعد الانتهاء',
        },
      },
      offerPath: {
        title: 'تقديم خدمة',
        step1: {
          title: 'إنشاء الملف الشخصي',
          description: 'قم بإعداد ملفك الاحترافي مع المهارات والمحفظة',
        },
        step2: {
          title: 'كن مرئيًا',
          description: 'كن مرئيًا لآلاف العملاء المحتملين في منطقتك',
        },
        step3: {
          title: 'نمو الأعمال',
          description: 'بناء السمعة من خلال المراجعات وتوسيع قاعدة عملائك',
        },
      },
    },
    testimonials: {
      title: 'ماذا يقول مستخدمونا',
      items: [
        {
          text: 'وجدت سباكًا ممتازًا في دقائق. كانت الخدمة سريعة ومهنية. أوصي بشدة!',
          name: 'سارة م.',
          role: 'صاحبة منزل',
        },
        {
          text: 'كعامل حر، ساعدتني هذه المنصة على زيادة قاعدة عملائي بنسبة 300٪ في 6 أشهر!',
          name: 'كريم ب.',
          role: 'مصمم جرافيك',
        },
        {
          text: 'يساعدني نظام التقييم على الثقة في المحترفين. لم أشعر بخيبة أمل أبدًا!',
          name: 'أمينة ل.',
          role: 'صاحبة عمل',
        },
      ],
    },
    faq: {
      title: 'الأسئلة الشائعة',
      items: [
        {
          question: 'كيف أبدأ؟',
          answer:
            'ببساطة اختر ما إذا كنت تريد العثور على خدمة أو تقديمها، أنشئ حسابًا وابدأ الاستكشاف. يستغرق الأمر أقل من دقيقتين للبدء!',
        },
        {
          question: 'هل الخدمة مجانية؟',
          answer:
            'إنشاء حساب وتصفح الخدمات مجاني تمامًا. نحن نفرض رسوم خدمة صغيرة فقط على المعاملات المكتملة للحفاظ على المنصة.',
        },
        {
          question: 'كيف يتم التحقق من المحترفين؟',
          answer:
            'يمر جميع المحترفين بعملية تحقق تشمل التحقق من الهوية وتقييم المهارات والتحقق من السجلات. نحافظ أيضًا على نظام مراجعة للشفافية.',
        },
        {
          question: 'ماذا لو لم أكن راضيًا؟',
          answer:
            'نقدم ضمان الرضا. إذا لم تكن راضيًا عن خدمة، اتصل بفريق الدعم لدينا في غضون 48 ساعة، وسنعمل على حل المشكلة أو تقديم استرداد.',
        },
        {
          question: 'هل يمكنني تقديم خدمات متعددة؟',
          answer:
            'نعم! يمكنك إدراج العديد من الخدمات كما تريد في ملفك الاحترافي. هذا يساعدك على الوصول إلى المزيد من العملاء عبر فئات مختلفة.',
        },
      ],
    },
    contact: {
      title: 'تواصل معنا',
      description:
        'لديك أسئلة أو تحتاج إلى مساعدة؟ نحن هنا للمساعدة. تواصل مع فريق الدعم لدينا في أي وقت.',
      form: {
        name: 'اسمك',
        email: 'البريد الإلكتروني',
        message: 'الرسالة',
        submit: 'إرسال الرسالة',
      },
    },
    signup: {
      title: 'تسجيل الحرفي',
      subtitle: 'أنشئ ملفك في 4 خطوات.',
      steps: {
        identity: 'الهوية',
        profession: 'المهنة',
        presentation: 'التعريف',
        account: 'الحساب',
      },
      panels: {
        identity: { title: 'الهوية' },
        profession: { title: 'المهنة' },
        presentation: { title: 'التعريف' },
        account: { title: 'الحساب' },
      },
      fields: {
        firstName: { label: 'الاسم الشخصي', placeholder: 'Ahmed' },
        lastName: { label: 'الاسم العائلي', placeholder: 'Benali' },
        email: { label: 'البريد الإلكتروني', placeholder: 'ahmed@example.com' },
        phone: { label: 'الهاتف', placeholder: '+2126XXXXXXXX' },
        profession: { label: 'المهنة', placeholder: 'Plumber' },
        category: { label: 'الفئة', placeholder: 'اختر فئة' },
        skills: {
          label: 'المهارات',
          placeholder: 'Repair, Installation, Emergency',
          help: 'افصل المهارات بفواصل.',
        },
        city: { label: 'المدينة الرئيسية', placeholder: 'Casablanca' },
        serviceAreas: {
          label: 'مناطق الخدمة',
          placeholder: 'Casablanca, Mohammedia',
          help: 'اذكر المدن التي يمكنك العمل فيها.',
        },
        bio: { label: 'نبذة', placeholder: 'عرّف العملاء بخبرتك...' },
        portfolioLinks: {
          label: 'روابط الأعمال',
          placeholder: 'https://example.com/project-1\nhttps://example.com/project-2',
          help: 'رابط واحد في كل سطر (اختياري).',
        },
        hourlyRate: { label: 'الأجر بالساعة (درهم)', placeholder: '250' },
        pricingNote: {
          label: 'ملاحظة التسعير',
          placeholder: 'الحد الأدنى ساعتان',
          help: 'ملاحظة اختيارية تظهر للعملاء.',
        },
        username: { label: 'اسم المستخدم', placeholder: 'ahmed.plumber' },
        password: { label: 'كلمة المرور', placeholder: '••••••••' },
        confirmPassword: { label: 'تأكيد كلمة المرور', placeholder: '••••••••' },
      },
      sms: {
        title: 'التحقق عبر SMS',
        subtitle: 'سنرسل رمزًا من 6 أرقام للتحقق من رقمك.',
        send: 'إرسال الرمز',
        sent: 'تم إرسال الرمز.',
        verified: 'تم التحقق من الهاتف.',
        mockHint: 'رسالة SMS تجريبية إلى {phone}: رمزك هو {code}',
        noCodeYet: 'لم يتم إرسال أي رمز بعد.',
        code: { label: 'رمز التحقق', placeholder: '123456' },
        errors: {
          enterPhone: 'أدخل رقم هاتفك أولاً.',
          invalidPhone: 'أدخل رقم هاتف مغربي صالح.',
          sendFirst: 'أرسل رمزًا أولاً.',
          invalidCodeFormat: 'أدخل رمزًا من 6 أرقام.',
          wrongCode: 'رمز غير صحيح. حاول مرة أخرى.',
        },
      },
      errors: {
        required: 'هذا الحقل مطلوب.',
        min2: 'يجب أن يكون على الأقل حرفين.',
        min3: 'يجب أن يكون على الأقل 3 أحرف.',
        minOne: 'أضف عنصرًا واحدًا على الأقل.',
        invalidEmail: 'أدخل بريدًا إلكترونيًا صالحًا.',
        invalidPhone: 'أدخل رقم هاتف مغربي صالح.',
        positiveNumber: 'أدخل رقمًا موجبًا.',
        invalidUrl: 'أدخل رابطًا صالحًا.',
        passwordMin6: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.',
        passwordMismatch: 'كلمتا المرور غير متطابقتين.',
        smsNotVerified: 'يرجى التحقق من رقم هاتفك.',
        fixBeforeSubmit: 'يرجى إصلاح الأخطاء قبل الإرسال.',
      },
      status: {
        submitting: 'جارٍ الإرسال...',
        submitSuccess: 'تم إرسال التسجيل بنجاح.',
        submitError: 'تعذر إرسال التسجيل.',
        networkError: 'خطأ في الشبكة. حاول مرة أخرى.',
        categoriesFallback: 'تعذر تحميل الفئات. تم عرض قائمة بديلة.',
      },
      actions: {
        back: 'رجوع',
        next: 'التالي',
        submit: 'إنشاء الحساب',
      },
      submitNote: 'بالإرسال، ستنشئ ملفك كحرفي.',
    },
    footer: {
      about: {
        title: 'عن 7رايفي',
        text: 'ربط المحترفين بالعملاء عبر خدمات متنوعة.',
      },
      links: {
        title: 'روابط سريعة',
        about: 'من نحن',
        terms: 'شروط الخدمة',
        privacy: 'سياسة الخصوصية',
      },
      support: {
        title: 'الدعم',
        help: 'مركز المساعدة',
        contact: 'اتصل بنا',
        faq: 'الأسئلة الشائعة',
      },
      copyright: '© 2024 7رايفي. جميع الحقوق محفوظة.',
    },
  },
};

class I18n {
  constructor(defaultLang = 'en') {
    this.currentLang = this.getSavedLanguage() || defaultLang;
    this.translations = translations;
  }

  getSavedLanguage() {
    return localStorage.getItem('language');
  }

  saveLanguage(lang) {
    localStorage.setItem('language', lang);
  }

  setLanguage(lang) {
    if (!this.translations[lang]) return;
    this.currentLang = lang;
    this.saveLanguage(lang);
    this.updatePage();
    this.updateDirection();
  }

  translate(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  }

  updatePage() {
    const textElements = document.querySelectorAll('[data-i18n]');
    textElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.translate(key);
      if (typeof translation !== 'string') return;
      if (translation === key) return;

      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    });

    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.translate(key);
      if (typeof translation !== 'string') return;
      if (translation === key) return;
      el.setAttribute('placeholder', translation);
    });

    const ariaLabelElements = document.querySelectorAll('[data-i18n-aria-label]');
    ariaLabelElements.forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      const translation = this.translate(key);
      if (typeof translation !== 'string') return;
      if (translation === key) return;
      el.setAttribute('aria-label', translation);
    });
  }

  updateDirection() {
    const html = document.documentElement;
    const body = document.body;

    if (this.currentLang === 'ar') {
      html.setAttribute('lang', 'ar');
      html.setAttribute('dir', 'rtl');
      body.setAttribute('dir', 'rtl');
    } else {
      html.setAttribute('lang', this.currentLang);
      html.removeAttribute('dir');
      body.removeAttribute('dir');
    }
  }
}

class Carousel {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.track = this.container.querySelector('.carousel-track');
    this.cards = Array.from(this.track.querySelectorAll('.testimonial-card'));
    this.prevButton = document.getElementById('carousel-prev');
    this.nextButton = document.getElementById('carousel-next');
    this.dotsContainer = document.querySelector('.carousel-dots');

    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.createDots();
    this.updateCarousel();
    this.setupEventListeners();
    this.startAutoplay();
  }

  createDots() {
    if (!this.dotsContainer) return;

    this.cards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
    });

    this.dots = Array.from(this.dotsContainer.querySelectorAll('.carousel-dot'));
  }

  setupEventListeners() {
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prev());
    }
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }

    let touchStartX = 0;
    let touchEndX = 0;

    this.container.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });

    this.container.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  handleSwipe(startX, endX) {
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  prev() {
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.cards.length - 1;
    this.updateCarousel();
    this.resetAutoplay();
  }

  next() {
    this.currentIndex = this.currentIndex < this.cards.length - 1 ? this.currentIndex + 1 : 0;
    this.updateCarousel();
    this.resetAutoplay();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoplay();
  }

  updateCarousel() {
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;

    if (this.prevButton) {
      this.prevButton.disabled = false;
    }
    if (this.nextButton) {
      this.nextButton.disabled = false;
    }

    if (this.dots) {
      this.dots.forEach((dot, index) => {
        if (index === this.currentIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('active');
          dot.setAttribute('aria-selected', 'false');
        }
      });
    }
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, 5000);
  }

  resetAutoplay() {
    clearInterval(this.autoplayInterval);
    this.startAutoplay();
  }
}

class FAQ {
  constructor() {
    this.items = document.querySelectorAll('.faq-item');
    this.init();
  }

  init() {
    this.items.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';

        this.items.forEach(otherItem => {
          const otherQuestion = otherItem.querySelector('.faq-question');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          otherQuestion.setAttribute('aria-expanded', 'false');
          otherAnswer.style.maxHeight = null;
        });

        if (!isExpanded) {
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }
}

class OrientationToggle {
  constructor() {
    this.buttons = document.querySelectorAll('.btn-toggle');
    this.ctaButton = document.getElementById('cta-button');
    this.selectedMode = 'find';
    this.init();
  }

  init() {
    this.buttons.forEach(button => {
      button.addEventListener('click', () => {
        const mode = button.getAttribute('data-mode');
        this.selectMode(mode);
      });
    });

    this.ctaButton?.addEventListener('click', () => {
      this.handleCTA();
    });
  }

  selectMode(mode) {
    this.selectedMode = mode;
    this.buttons.forEach(button => {
      const buttonMode = button.getAttribute('data-mode');
      if (buttonMode === mode) {
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
      }
    });
  }

  handleCTA() {
    if (this.selectedMode === 'find') {
      console.log('Redirecting to search page...');
      window.location.href = '/search.html';
    } else {
      console.log('Redirecting to signup page...');
      window.location.href = '/signup.html';
    }
  }
}

class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  async handleSubmit() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Contact form submitted:', data);

      alert('Thank you for your message! We will get back to you soon.');
      this.form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error sending your message. Please try again.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const i18n = new I18n();
  window.i18n = i18n;

  const languageSelector = document.getElementById('language-selector');
  if (languageSelector) {
    languageSelector.value = i18n.currentLang;
    languageSelector.addEventListener('change', e => {
      i18n.setLanguage(e.target.value);
    });
  }

  i18n.updatePage();
  i18n.updateDirection();

  new Carousel('.carousel-container');
  new FAQ();
  new OrientationToggle();
  new ContactForm();

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
  });
});
