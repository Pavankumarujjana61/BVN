require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const db = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup public uploads folder
const UPLOADS_DIR = path.join(__dirname, 'public/uploads');
const IMAGES_DIR = path.join(__dirname, 'public/images');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration (for Admin CMS Auth)
app.use(session({
  secret: 'bvn-modulars-secret-key-13579',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Admin Auth Middleware
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Homepage
app.get('/', async (req, res) => {
  try {
    const projects = await db.getProjects();
    const testimonials = await db.getTestimonials();
    const pricing = await db.getPricing();
    const banners = await db.getBanners();
    
    // Show first 6 projects as featured
    const featuredProjects = projects.slice(0, 6);
    
    res.render('index', {
      activePage: 'home',
      isHome: true,
      title: 'BVN Modulars | Factory-Made Modular Furniture Rajahmundry',
      metaDescription: 'Get premium factory-made modular kitchens, wardrobes, and furniture solutions in Rajahmundry. Designed in 3D, built in our own factory with 0.1mm CNC precision.',
      featuredProjects,
      testimonials,
      pricing,
      banners,
      success: req.query.success === 'true'
    });
  } catch (error) {
    console.error('Error serving homepage:', error);
    res.status(500).send('Internal Server Error');
  }
});

// About Us
app.get('/about', (req, res) => {
  res.render('about', {
    activePage: 'about',
    title: 'About Us | BVN Modulars Rajahmundry',
    metaDescription: 'Learn about BVN Modulars, our founding story, team of 3D designers, and our 15,000 sq ft modular furniture manufacturing unit in Rajahmundry.'
  });
});

// Services
app.get('/services', (req, res) => {
  res.render('services', {
    activePage: 'services',
    title: 'Modular Services | BVN Modulars Rajahmundry',
    metaDescription: 'Explore our modular services: L-shape kitchens, sliding wardrobes, backlit TV units, crockery display cabinets, bedroom sets, and office interiors.'
  });
});

// Projects Gallery
app.get('/projects', async (req, res) => {
  try {
    const projects = await db.getProjects();
    res.render('projects', {
      activePage: 'projects',
      title: 'Modular Project Gallery | BVN Modulars Rajahmundry',
      metaDescription: 'View real completed modular projects in Rajahmundry and Andhra Pradesh. Modular kitchens, wardrobes, and living room units with premium finish.',
      projects
    });
  } catch (error) {
    console.error('Error serving projects:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Factory Tour
app.get('/factory-tour', (req, res) => {
  res.render('factory-tour', {
    activePage: 'factory-tour',
    title: 'Factory Manufacturing Tour | BVN Modulars',
    metaDescription: 'Take a virtual tour of our Rajahmundry factory. See our CNC Router, automated Edge Bander, and hot-press Laminate Press machines in action.'
  });
});

// Materials Guide
app.get('/materials', (req, res) => {
  res.render('materials', {
    activePage: 'materials',
    title: 'Trusted Modular Materials Guide | BVN Modulars',
    metaDescription: 'Learn about modular kitchen and wardrobe materials. Boiling Water Proof (BWP) marine ply, high-gloss acrylics, Hettich, and Hafele hardware.'
  });
});

// Testimonials Page
app.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await db.getTestimonials();
    res.render('testimonials', {
      activePage: 'testimonials',
      title: 'Customer Reviews & Videos | BVN Modulars Rajahmundry',
      metaDescription: 'Read customer reviews and watch video testimonials from homeowners in Rajahmundry who chose our factory-made modular solutions.',
      testimonials
    });
  } catch (error) {
    console.error('Error serving testimonials:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Blog List
app.get('/blog', async (req, res) => {
  try {
    const blogs = await db.getBlogs();
    res.render('blog', {
      activePage: 'blog',
      title: 'Modular Furniture Blog | BVN Modulars Rajahmundry',
      metaDescription: 'Read home interior tips, modular kitchen guide, and design trends in Rajahmundry and Andhra Pradesh. Write-ups by furniture experts.',
      blogs
    });
  } catch (error) {
    console.error('Error serving blog:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Blog Post Detail
app.get('/blog/:id', async (req, res) => {
  try {
    const blogs = await db.getBlogs();
    const blog = blogs.find(b => b.id === req.params.id);
    
    if (!blog) {
      return res.status(404).send('Blog Post Not Found');
    }
    
    res.render('blog-post', {
      activePage: 'blog',
      title: blog.metaTitle,
      metaDescription: blog.metaDescription,
      blog
    });
  } catch (error) {
    console.error('Error serving blog detail:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Contact Page
app.get('/contact', (req, res) => {
  res.render('contact', {
    activePage: 'contact',
    title: 'Contact Us | BVN Modulars Rajahmundry',
    metaDescription: 'Get in touch with BVN Modulars. Visit our Rajahmundry factory, call us, or submit a form for a free 3D design consultation.',
    success: req.query.success === 'true'
  });
});

// Enquiry Form Submission
app.post('/enquire', async (req, res) => {
  try {
    const { name, phone, city, service, message } = req.body;
    
    if (!name || !phone || !city || !service) {
      return res.status(400).send('Required fields are missing');
    }
    
    const enquiry = {
      id: Date.now().toString(),
      name,
      phone,
      city,
      service,
      message,
      date: new Date().toISOString()
    };
    
    await db.saveEnquiry(enquiry);
    
    // Redirect back to the page from which they submitted
    const referer = req.get('Referer') || '/';
    const redirectUrl = referer.includes('?') ? `${referer}&success=true` : `${referer}?success=true`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error saving enquiry:', error);
    res.status(500).send('Internal Server Error');
  }
});


// ==========================================
// ADMIN PORTAL ROUTES
// ==========================================

// Login Page
app.get('/admin/login', (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: null });
});

// Login POST
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const isValid = await db.validateAdmin(username, password);
    if (isValid) {
      req.session.isAdmin = true;
      res.redirect('/admin');
    } else {
      res.render('admin/login', { error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.render('admin/login', { error: 'An error occurred during authentication' });
  }
});

// Logout
app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Dashboard Main Overview
app.get('/admin', requireAdmin, async (req, res) => {
  try {
    const projects = await db.getProjects();
    const testimonials = await db.getTestimonials();
    const blogs = await db.getBlogs();
    const enquiries = await db.getEnquiries();
    const banners = await db.getBanners();
    
    const stats = {
      projectsCount: projects.length,
      testimonialsCount: testimonials.length,
      blogsCount: blogs.length,
      bannersCount: banners.length,
      enquiriesCount: enquiries.length
    };
    
    // Show 5 most recent enquiries
    const recentEnquiries = enquiries.slice(0, 5);
    
    res.render('admin/dashboard', {
      stats,
      recentEnquiries
    });
  } catch (error) {
    console.error('Error rendering admin dashboard:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Manage Projects
app.get('/admin/projects', requireAdmin, async (req, res) => {
  try {
    const projects = await db.getProjects();
    const editId = req.query.edit;
    const editProject = editId ? projects.find(p => p.id === editId) : null;
    res.render('admin/projects', {
      projects,
      editProject,
      success: req.query.success ? (req.query.edit_success ? 'Project updated successfully' : 'Project added successfully') : null
    });
  } catch (error) {
    console.error('Error listing admin projects:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add Project Action
app.post('/admin/projects/add', requireAdmin, upload.single('projectImage'), async (req, res) => {
  try {
    const { title, category, location, description } = req.body;
    
    if (!req.file) {
      return res.status(400).send('Please upload an image file');
    }
    
    const project = {
      id: 'project-' + Date.now().toString(),
      title,
      category,
      location,
      image: '/uploads/' + req.file.filename,
      description
    };
    
    await db.saveProject(project);
    res.redirect('/admin/projects?success=true');
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit Project Action
app.post('/admin/projects/edit/:id', requireAdmin, upload.single('projectImage'), async (req, res) => {
  try {
    const { title, category, location, description } = req.body;
    const projects = await db.getProjects();
    const projectIndex = projects.findIndex(p => p.id === req.params.id);
    
    if (projectIndex === -1) {
      return res.status(404).send('Project not found');
    }
    
    const existingProject = projects[projectIndex];
    let imagePath = existingProject.image;
    
    if (req.file) {
      // If a new image is uploaded, delete the old one
      if (existingProject.image && existingProject.image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, 'public', existingProject.image);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch(e) {}
        }
      }
      imagePath = '/uploads/' + req.file.filename;
    }
    
    const updatedProject = {
      id: req.params.id,
      title,
      category,
      location,
      image: imagePath,
      description
    };
    
    await db.saveProject(updatedProject);
    res.redirect('/admin/projects?success=true&edit_success=true');
  } catch (error) {
    console.error('Error editing project:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete Project Action
app.post('/admin/projects/delete/:id', requireAdmin, async (req, res) => {
  try {
    const projects = await db.getProjects();
    const project = projects.find(p => p.id === req.params.id);
    if (project && project.image.startsWith('/uploads/')) {
      // Delete local file if uploaded
      const filePath = path.join(__dirname, 'public', project.image);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch(e) {}
      }
    }
    await db.deleteProject(req.params.id);
    res.redirect('/admin/projects?success=true');
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Manage Testimonials
app.get('/admin/testimonials', requireAdmin, async (req, res) => {
  try {
    const testimonials = await db.getTestimonials();
    const editId = req.query.edit;
    const editTestimonial = editId ? testimonials.find(t => t.id === editId) : null;
    res.render('admin/testimonials', {
      testimonials,
      editTestimonial,
      success: req.query.success ? (req.query.edit_success ? 'Review updated successfully' : 'Review added successfully') : null
    });
  } catch (error) {
    console.error('Error listing admin testimonials:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add Testimonial Action
app.post('/admin/testimonials/add', requireAdmin, upload.fields([
  { name: 'customerPhoto', maxCount: 1 },
  { name: 'projectPhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const { customerName, location, serviceType, rating, videoEmbed, text } = req.body;
    
    if (!req.files || !req.files['customerPhoto'] || !req.files['projectPhoto']) {
      return res.status(400).send('Please upload both customer and project photographs.');
    }
    
    const testimonial = {
      id: 'testimonial-' + Date.now().toString(),
      customerName,
      location,
      serviceType,
      rating: parseInt(rating),
      customerPhoto: '/uploads/' + req.files['customerPhoto'][0].filename,
      projectPhoto: '/uploads/' + req.files['projectPhoto'][0].filename,
      text,
      videoEmbed: videoEmbed || ''
    };
    
    await db.saveTestimonial(testimonial);
    res.redirect('/admin/testimonials?success=true');
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit Testimonial Action
app.post('/admin/testimonials/edit/:id', requireAdmin, upload.fields([
  { name: 'customerPhoto', maxCount: 1 },
  { name: 'projectPhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const { customerName, location, serviceType, rating, videoEmbed, text } = req.body;
    const testimonials = await db.getTestimonials();
    const testimonialIndex = testimonials.findIndex(t => t.id === req.params.id);
    
    if (testimonialIndex === -1) {
      return res.status(404).send('Review not found');
    }
    
    const existingTestimonial = testimonials[testimonialIndex];
    let customerPhotoPath = existingTestimonial.customerPhoto;
    let projectPhotoPath = existingTestimonial.projectPhoto;
    
    if (req.files) {
      if (req.files['customerPhoto']) {
        if (existingTestimonial.customerPhoto && existingTestimonial.customerPhoto.startsWith('/uploads/')) {
          const oldPath = path.join(__dirname, 'public', existingTestimonial.customerPhoto);
          if (fs.existsSync(oldPath)) {
            try { fs.unlinkSync(oldPath); } catch(e) {}
          }
        }
        customerPhotoPath = '/uploads/' + req.files['customerPhoto'][0].filename;
      }
      if (req.files['projectPhoto']) {
        if (existingTestimonial.projectPhoto && existingTestimonial.projectPhoto.startsWith('/uploads/')) {
          const oldPath = path.join(__dirname, 'public', existingTestimonial.projectPhoto);
          if (fs.existsSync(oldPath)) {
            try { fs.unlinkSync(oldPath); } catch(e) {}
          }
        }
        projectPhotoPath = '/uploads/' + req.files['projectPhoto'][0].filename;
      }
    }
    
    const updatedTestimonial = {
      id: req.params.id,
      customerName,
      location,
      serviceType,
      rating: parseInt(rating),
      customerPhoto: customerPhotoPath,
      projectPhoto: projectPhotoPath,
      text,
      videoEmbed: videoEmbed || ''
    };
    
    await db.saveTestimonial(updatedTestimonial);
    res.redirect('/admin/testimonials?success=true&edit_success=true');
  } catch (error) {
    console.error('Error editing testimonial:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete Testimonial Action
app.post('/admin/testimonials/delete/:id', requireAdmin, async (req, res) => {
  try {
    const testimonials = await db.getTestimonials();
    const testimonial = testimonials.find(t => t.id === req.params.id);
    if (testimonial) {
      if (testimonial.customerPhoto.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, 'public', testimonial.customerPhoto);
        if (fs.existsSync(filePath)) { try { fs.unlinkSync(filePath); } catch(e) {} }
      }
      if (testimonial.projectPhoto.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, 'public', testimonial.projectPhoto);
        if (fs.existsSync(filePath)) { try { fs.unlinkSync(filePath); } catch(e) {} }
      }
    }
    await db.deleteTestimonial(req.params.id);
    res.redirect('/admin/testimonials?success=true');
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Manage Pricing
app.get('/admin/pricing', requireAdmin, async (req, res) => {
  try {
    const pricing = await db.getPricing();
    res.render('admin/pricing', {
      pricing,
      success: req.query.success ? 'Pricing package updated successfully' : null
    });
  } catch (error) {
    console.error('Error listing admin pricing:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update Pricing Action
app.post('/admin/pricing/update/:id', requireAdmin, async (req, res) => {
  try {
    const { startingPrice, isPopular, inclusions } = req.body;
    const pricing = await db.getPricing();
    
    const index = pricing.findIndex(p => p.id === req.params.id);
    if (index >= 0) {
      pricing[index].startingPrice = startingPrice;
      pricing[index].isPopular = isPopular === 'true';
      
      // Split inclusions text into array
      pricing[index].inclusions = inclusions.split('\n').map(line => line.trim()).filter(Boolean);
      
      await db.savePricing(pricing);
    }
    
    res.redirect('/admin/pricing?success=true');
  } catch (error) {
    console.error('Error updating admin pricing:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Manage Blogs
app.get('/admin/blogs', requireAdmin, async (req, res) => {
  try {
    const blogs = await db.getBlogs();
    const editId = req.query.edit;
    const editBlog = editId ? blogs.find(b => b.id === editId) : null;
    res.render('admin/blogs', {
      blogs,
      editBlog,
      success: req.query.success ? (req.query.edit_success ? 'Blog post updated successfully' : 'Blog post published successfully') : null
    });
  } catch (error) {
    console.error('Error listing admin blogs:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add Blog Action
app.post('/admin/blogs/add', requireAdmin, upload.single('blogImage'), async (req, res) => {
  try {
    const { id, title, summary, content, metaTitle, metaDescription } = req.body;
    
    if (!req.file) {
      return res.status(400).send('Please upload a cover image');
    }
    
    // Format slug to lowercase-with-hyphens
    const formattedSlug = id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const blog = {
      id: formattedSlug,
      title,
      summary,
      content,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      image: '/uploads/' + req.file.filename,
      metaTitle,
      metaDescription
    };
    
    await db.saveBlog(blog);
    res.redirect('/admin/blogs?success=true');
  } catch (error) {
    console.error('Error adding blog:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit Blog Action
app.post('/admin/blogs/edit/:id', requireAdmin, upload.single('blogImage'), async (req, res) => {
  try {
    const { title, summary, content, metaTitle, metaDescription } = req.body;
    const blogs = await db.getBlogs();
    const blogIndex = blogs.findIndex(b => b.id === req.params.id);
    
    if (blogIndex === -1) {
      return res.status(404).send('Blog post not found');
    }
    
    const existingBlog = blogs[blogIndex];
    let imagePath = existingBlog.image;
    
    if (req.file) {
      if (existingBlog.image && existingBlog.image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, 'public', existingBlog.image);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch(e) {}
        }
      }
      imagePath = '/uploads/' + req.file.filename;
    }
    
    const updatedBlog = {
      id: req.params.id,
      title,
      summary,
      content,
      date: existingBlog.date, // Retain original publish date
      image: imagePath,
      metaTitle,
      metaDescription
    };
    
    await db.saveBlog(updatedBlog);
    res.redirect('/admin/blogs?success=true&edit_success=true');
  } catch (error) {
    console.error('Error editing blog:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete Blog Action
app.post('/admin/blogs/delete/:id', requireAdmin, async (req, res) => {
  try {
    const blogs = await db.getBlogs();
    const blog = blogs.find(b => b.id === req.params.id);
    if (blog && blog.image.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, 'public', blog.image);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch(e) {}
      }
    }
    await db.deleteBlog(req.params.id);
    res.redirect('/admin/blogs?success=true');
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Manage Banners
app.get('/admin/banners', requireAdmin, async (req, res) => {
  try {
    const banners = await db.getBanners();
    const editId = req.query.edit;
    const editBanner = editId ? banners.find(b => b.id === editId) : null;
    res.render('admin/banners', {
      banners,
      editBanner,
      success: req.query.success ? (req.query.edit_success ? 'Banner updated successfully' : 'Banner added successfully') : null
    });
  } catch (error) {
    console.error('Error listing admin banners:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add Banner Action
app.post('/admin/banners/add', requireAdmin, upload.single('bannerImage'), async (req, res) => {
  try {
    const { title, subtitle, btn1Text, btn1Url, btn2Text, btn2Url } = req.body;
    
    if (!req.file) {
      return res.status(400).send('Please upload a banner image');
    }
    
    const banner = {
      id: 'banner-' + Date.now().toString(),
      title,
      subtitle,
      btn1Text: btn1Text || '',
      btn1Url: btn1Url || '',
      btn2Text: btn2Text || '',
      btn2Url: btn2Url || '',
      image: '/uploads/' + req.file.filename
    };
    
    await db.saveBanner(banner);
    res.redirect('/admin/banners?success=true');
  } catch (error) {
    console.error('Error adding banner:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit Banner Action
app.post('/admin/banners/edit/:id', requireAdmin, upload.single('bannerImage'), async (req, res) => {
  try {
    const { title, subtitle, btn1Text, btn1Url, btn2Text, btn2Url } = req.body;
    const banners = await db.getBanners();
    const index = banners.findIndex(b => b.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).send('Banner not found');
    }
    
    const existingBanner = banners[index];
    let imagePath = existingBanner.image;
    
    if (req.file) {
      if (existingBanner.image && existingBanner.image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, 'public', existingBanner.image);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch(e) {}
        }
      }
      imagePath = '/uploads/' + req.file.filename;
    }
    
    const updatedBanner = {
      id: req.params.id,
      title,
      subtitle,
      btn1Text: btn1Text || '',
      btn1Url: btn1Url || '',
      btn2Text: btn2Text || '',
      btn2Url: btn2Url || '',
      image: imagePath
    };
    
    await db.saveBanner(updatedBanner);
    res.redirect('/admin/banners?success=true&edit_success=true');
  } catch (error) {
    console.error('Error editing banner:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete Banner Action
app.post('/admin/banners/delete/:id', requireAdmin, async (req, res) => {
  try {
    const banners = await db.getBanners();
    const banner = banners.find(b => b.id === req.params.id);
    if (banner && banner.image.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, 'public', banner.image);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch(e) {}
      }
    }
    await db.deleteBanner(req.params.id);
    res.redirect('/admin/banners?success=true');
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Enquiries List
app.get('/admin/enquiries', requireAdmin, async (req, res) => {
  try {
    const enquiries = await db.getEnquiries();
    res.render('admin/enquiries', {
      enquiries
    });
  } catch (error) {
    console.error('Error listing enquiries:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Admin Settings Page
app.get('/admin/settings', requireAdmin, (req, res) => {
  res.render('admin/settings', {
    success: req.query.success === 'true' ? 'Credentials updated successfully' : null,
    error: req.query.error || null
  });
});

// Update Admin Credentials Action
app.post('/admin/settings/update', requireAdmin, async (req, res) => {
  const { newUsername, newPassword, confirmPassword } = req.body;

  if (!newUsername || !newPassword || !confirmPassword) {
    return res.redirect('/admin/settings?error=All%20fields%20are%20required');
  }

  if (newPassword !== confirmPassword) {
    return res.redirect('/admin/settings?error=Passwords%20do%20not%20match');
  }

  try {
    await db.updateAdmin(newUsername, newPassword);
    res.redirect('/admin/settings?success=true');
  } catch (error) {
    console.error('Error updating admin credentials:', error);
    res.redirect('/admin/settings?error=Database%20update%20failed');
  }
});

// Start Server after database is successfully initialized
db.initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`BVN Modulars website running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('CRITICAL ERROR: Failed to initialize database:', err);
  process.exit(1);
});
