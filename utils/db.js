const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config();

let pool;
let useFallback = false;
const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists for fallback mode
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Fallback JSON DB Functions
function readJSONFile(filename, defaultValue = []) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

function writeJSONFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

async function createTables() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS \`admins\` (
      \`username\` VARCHAR(100) NOT NULL,
      \`password\` VARCHAR(255) NOT NULL,
      PRIMARY KEY (\`username\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS \`banners\` (
      \`id\` VARCHAR(100) NOT NULL,
      \`image\` VARCHAR(255) NOT NULL,
      \`title\` VARCHAR(255) NOT NULL,
      \`subtitle\` TEXT NOT NULL,
      \`btn1Text\` VARCHAR(100) NOT NULL,
      \`btn1Url\` VARCHAR(255) NOT NULL,
      \`btn2Text\` VARCHAR(100) NOT NULL,
      \`btn2Url\` VARCHAR(255) NOT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS \`blogs\` (
      \`id\` VARCHAR(255) NOT NULL,
      \`title\` VARCHAR(255) NOT NULL,
      \`summary\` TEXT NOT NULL,
      \`content\` MEDIUMTEXT NOT NULL,
      \`date\` VARCHAR(100) NOT NULL,
      \`metaTitle\` VARCHAR(255) NOT NULL,
      \`metaDescription\` TEXT NOT NULL,
      \`image\` VARCHAR(255) NOT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS \`enquiries\` (
      \`id\` VARCHAR(100) NOT NULL,
      \`name\` VARCHAR(255) NOT NULL,
      \`phone\` VARCHAR(50) NOT NULL,
      \`city\` VARCHAR(255) NOT NULL,
      \`service\` VARCHAR(255) NOT NULL,
      \`message\` TEXT NOT NULL,
      \`date\` VARCHAR(100) NOT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS \`pricing\` (
      \`id\` VARCHAR(100) NOT NULL,
      \`name\` VARCHAR(255) NOT NULL,
      \`startingPrice\` VARCHAR(50) NOT NULL,
      \`priceUnit\` VARCHAR(50) NOT NULL,
      \`inclusions\` TEXT NOT NULL,
      \`isPopular\` TINYINT(1) NOT NULL DEFAULT 0,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS \`projects\` (
      \`id\` VARCHAR(100) NOT NULL,
      \`title\` VARCHAR(255) NOT NULL,
      \`category\` VARCHAR(100) NOT NULL,
      \`location\` VARCHAR(255) NOT NULL,
      \`image\` VARCHAR(255) NOT NULL,
      \`description\` TEXT NOT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS \`testimonials\` (
      \`id\` VARCHAR(100) NOT NULL,
      \`customerName\` VARCHAR(255) NOT NULL,
      \`location\` VARCHAR(255) NOT NULL,
      \`rating\` INT NOT NULL,
      \`customerPhoto\` VARCHAR(255) NOT NULL,
      \`projectPhoto\` VARCHAR(255) NOT NULL,
      \`text\` TEXT NOT NULL,
      \`serviceType\` VARCHAR(255) NOT NULL,
      \`videoEmbed\` TEXT,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  ];

  for (const query of queries) {
    await pool.query(query);
  }
}

async function seedTables() {
  // Seed admins
  const [adminsCount] = await pool.query('SELECT COUNT(*) as count FROM admins');
  if (adminsCount[0].count === 0) {
    await pool.query(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      ['admin', 'baa1886bf60bbd62ea281e109eb0fe82b8ffd8bc32a8b2c051882227d5414704']
    );
  }

  // Seed banners
  const [bannersCount] = await pool.query('SELECT COUNT(*) as count FROM banners');
  if (bannersCount[0].count === 0) {
    const bannersPath = path.join(DATA_DIR, 'banners.json');
    if (fs.existsSync(bannersPath)) {
      const bannersData = JSON.parse(fs.readFileSync(bannersPath, 'utf8'));
      for (const banner of bannersData) {
        await pool.query(
          `INSERT INTO banners (id, image, title, subtitle, btn1Text, btn1Url, btn2Text, btn2Url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [banner.id, banner.image, banner.title, banner.subtitle, banner.btn1Text || '', banner.btn1Url || '', banner.btn2Text || '', banner.btn2Url || '']
        );
      }
    }
  }

  // Seed blogs
  const [blogsCount] = await pool.query('SELECT COUNT(*) as count FROM blogs');
  if (blogsCount[0].count === 0) {
    const blogsPath = path.join(DATA_DIR, 'blogs.json');
    if (fs.existsSync(blogsPath)) {
      const blogsData = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
      for (const blog of blogsData) {
        await pool.query(
          `INSERT INTO blogs (id, title, summary, content, date, metaTitle, metaDescription, image)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [blog.id, blog.title, blog.summary, blog.content, blog.date, blog.metaTitle, blog.metaDescription, blog.image]
        );
      }
    }
  }

  // Seed enquiries
  const [enquiriesCount] = await pool.query('SELECT COUNT(*) as count FROM enquiries');
  if (enquiriesCount[0].count === 0) {
    const enquiriesPath = path.join(DATA_DIR, 'enquiries.json');
    if (fs.existsSync(enquiriesPath)) {
      const enquiriesData = JSON.parse(fs.readFileSync(enquiriesPath, 'utf8'));
      for (const enquiry of enquiriesData) {
        await pool.query(
          `INSERT INTO enquiries (id, name, phone, city, service, message, date)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [enquiry.id, enquiry.name, enquiry.phone, enquiry.city, enquiry.service, enquiry.message, enquiry.date]
        );
      }
    }
  }

  // Seed pricing
  const [pricingCount] = await pool.query('SELECT COUNT(*) as count FROM pricing');
  if (pricingCount[0].count === 0) {
    const pricingPath = path.join(DATA_DIR, 'pricing.json');
    if (fs.existsSync(pricingPath)) {
      const pricingData = JSON.parse(fs.readFileSync(pricingPath, 'utf8'));
      for (const price of pricingData) {
        await pool.query(
          `INSERT INTO pricing (id, name, startingPrice, priceUnit, inclusions, isPopular)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [price.id, price.name, price.startingPrice, price.priceUnit, JSON.stringify(price.inclusions), price.isPopular ? 1 : 0]
        );
      }
    }
  }

  // Seed projects
  const [projectsCount] = await pool.query('SELECT COUNT(*) as count FROM projects');
  if (projectsCount[0].count === 0) {
    const projectsPath = path.join(DATA_DIR, 'projects.json');
    if (fs.existsSync(projectsPath)) {
      const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
      for (const project of projectsData) {
        await pool.query(
          `INSERT INTO projects (id, title, category, location, image, description)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [project.id, project.title, project.category, project.location, project.image, project.description]
        );
      }
    }
  }

  // Seed testimonials
  const [testimonialsCount] = await pool.query('SELECT COUNT(*) as count FROM testimonials');
  if (testimonialsCount[0].count === 0) {
    const testimonialsPath = path.join(DATA_DIR, 'testimonials.json');
    if (fs.existsSync(testimonialsPath)) {
      const testimonialsData = JSON.parse(fs.readFileSync(testimonialsPath, 'utf8'));
      for (const t of testimonialsData) {
        await pool.query(
          `INSERT INTO testimonials (id, customerName, location, rating, customerPhoto, projectPhoto, text, serviceType, videoEmbed)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [t.id, t.customerName, t.location, t.rating, t.customerPhoto, t.projectPhoto, t.text, t.serviceType, t.videoEmbed || '']
        );
      }
    }
  }
}

module.exports = {
  // DB Initialization
  async initDB() {
    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'bvn_db';

    try {
      // 1. First establish a connection without a database to create it if it doesn't exist
      let connection;
      try {
        connection = await mysql.createConnection({
          host,
          user,
          password
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
      } catch (error) {
        console.warn('Warning: Could not check/create database (normal if permissions restricted):', error.message);
      } finally {
        if (connection) {
          await connection.end();
        }
      }

      // 2. Establish connection pool with the database specified
      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Quick test query to verify we can connect successfully
      await pool.query('SELECT 1');

      // 3. Create tables if they do not exist
      await createTables();

      // 4. Auto-seed tables from JSON if they are empty
      await seedTables();

      useFallback = false;
      console.log('MySQL Database initialized, tables verified, and auto-seeded.');
    } catch (err) {
      console.warn('\n================================================================');
      console.warn('WARNING: MySQL Connection Failed!');
      console.warn('Reason:', err.message);
      console.warn('Falling back to local JSON database files for offline development.');
      console.warn('================================================================\n');
      useFallback = true;
    }
  },

  // Validate Admin Credentials
  async validateAdmin(username, password) {
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (useFallback) {
      const admins = readJSONFile('admins.json', [
        { username: 'admin', password: 'baa1886bf60bbd62ea281e109eb0fe82b8ffd8bc32a8b2c051882227d5414704' }
      ]);
      return admins.some(a => a.username === username && a.password === hashedPassword);
    }

    const [rows] = await pool.query('SELECT password FROM admins WHERE username = ?', [username]);
    if (rows.length === 0) return false;
    return rows[0].password === hashedPassword;
  },
  async updateAdmin(newUsername, newPassword) {
    const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

    if (useFallback) {
      const admins = [
        { username: newUsername, password: hashedPassword }
      ];
      return writeJSONFile('admins.json', admins);
    }

    await pool.query('DELETE FROM admins');
    await pool.query('INSERT INTO admins (username, password) VALUES (?, ?)', [newUsername, hashedPassword]);
    return true;
  },

  // Projects
  async getProjects() {
    if (useFallback) {
      return readJSONFile('projects.json', []);
    }
    const [rows] = await pool.query('SELECT * FROM projects');
    return rows;
  },
  async saveProject(project) {
    if (useFallback) {
      const projects = readJSONFile('projects.json', []);
      const index = projects.findIndex(p => p.id === project.id);
      if (index >= 0) {
        projects[index] = { ...projects[index], ...project };
      } else {
        projects.push(project);
      }
      return writeJSONFile('projects.json', projects);
    }
    const [rows] = await pool.query('SELECT id FROM projects WHERE id = ?', [project.id]);
    if (rows.length > 0) {
      await pool.query(
        'UPDATE projects SET title = ?, category = ?, location = ?, image = ?, description = ? WHERE id = ?',
        [project.title, project.category, project.location, project.image, project.description, project.id]
      );
    } else {
      await pool.query(
        'INSERT INTO projects (id, title, category, location, image, description) VALUES (?, ?, ?, ?, ?, ?)',
        [project.id, project.title, project.category, project.location, project.image, project.description]
      );
    }
    return true;
  },
  async deleteProject(id) {
    if (useFallback) {
      const projects = readJSONFile('projects.json', []);
      const filtered = projects.filter(p => p.id !== id);
      return writeJSONFile('projects.json', filtered);
    }
    await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    return true;
  },

  // Testimonials
  async getTestimonials() {
    if (useFallback) {
      return readJSONFile('testimonials.json', []);
    }
    const [rows] = await pool.query('SELECT * FROM testimonials');
    return rows;
  },
  async saveTestimonial(testimonial) {
    if (useFallback) {
      const testimonials = readJSONFile('testimonials.json', []);
      const index = testimonials.findIndex(t => t.id === testimonial.id);
      if (index >= 0) {
        testimonials[index] = { ...testimonials[index], ...testimonial };
      } else {
        testimonials.push(testimonial);
      }
      return writeJSONFile('testimonials.json', testimonials);
    }
    const [rows] = await pool.query('SELECT id FROM testimonials WHERE id = ?', [testimonial.id]);
    if (rows.length > 0) {
      await pool.query(
        'UPDATE testimonials SET customerName = ?, location = ?, rating = ?, customerPhoto = ?, projectPhoto = ?, text = ?, serviceType = ?, videoEmbed = ? WHERE id = ?',
        [testimonial.customerName, testimonial.location, testimonial.rating, testimonial.customerPhoto, testimonial.projectPhoto, testimonial.text, testimonial.serviceType, testimonial.videoEmbed || '', testimonial.id]
      );
    } else {
      await pool.query(
        'INSERT INTO testimonials (id, customerName, location, rating, customerPhoto, projectPhoto, text, serviceType, videoEmbed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [testimonial.id, testimonial.customerName, testimonial.location, testimonial.rating, testimonial.customerPhoto, testimonial.projectPhoto, testimonial.text, testimonial.serviceType, testimonial.videoEmbed || '']
      );
    }
    return true;
  },
  async deleteTestimonial(id) {
    if (useFallback) {
      const testimonials = readJSONFile('testimonials.json', []);
      const filtered = testimonials.filter(t => t.id !== id);
      return writeJSONFile('testimonials.json', filtered);
    }
    await pool.query('DELETE FROM testimonials WHERE id = ?', [id]);
    return true;
  },

  // Pricing
  async getPricing() {
    if (useFallback) {
      return readJSONFile('pricing.json', []);
    }
    const [rows] = await pool.query('SELECT * FROM pricing');
    return rows.map(r => {
      try {
        return {
          ...r,
          inclusions: JSON.parse(r.inclusions),
          isPopular: !!r.isPopular
        };
      } catch (e) {
        return {
          ...r,
          inclusions: [],
          isPopular: !!r.isPopular
        };
      }
    });
  },
  async savePricing(packages) {
    if (useFallback) {
      return writeJSONFile('pricing.json', packages);
    }
    for (const pkg of packages) {
      await pool.query(
        'UPDATE pricing SET startingPrice = ?, isPopular = ?, inclusions = ? WHERE id = ?',
        [pkg.startingPrice, pkg.isPopular ? 1 : 0, JSON.stringify(pkg.inclusions), pkg.id]
      );
    }
    return true;
  },

  // Blogs
  async getBlogs() {
    if (useFallback) {
      return readJSONFile('blogs.json', []);
    }
    const [rows] = await pool.query('SELECT * FROM blogs');
    return rows;
  },
  async saveBlog(blog) {
    if (useFallback) {
      const blogs = readJSONFile('blogs.json', []);
      const index = blogs.findIndex(b => b.id === blog.id);
      if (index >= 0) {
        blogs[index] = { ...blogs[index], ...blog };
      } else {
        blogs.push(blog);
      }
      return writeJSONFile('blogs.json', blogs);
    }
    const [rows] = await pool.query('SELECT id FROM blogs WHERE id = ?', [blog.id]);
    if (rows.length > 0) {
      await pool.query(
        'UPDATE blogs SET title = ?, summary = ?, content = ?, date = ?, metaTitle = ?, metaDescription = ?, image = ? WHERE id = ?',
        [blog.title, blog.summary, blog.content, blog.date, blog.metaTitle, blog.metaDescription, blog.image, blog.id]
      );
    } else {
      await pool.query(
        'INSERT INTO blogs (id, title, summary, content, date, metaTitle, metaDescription, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [blog.id, blog.title, blog.summary, blog.content, blog.date, blog.metaTitle, blog.metaDescription, blog.image]
      );
    }
    return true;
  },
  async deleteBlog(id) {
    if (useFallback) {
      const blogs = readJSONFile('blogs.json', []);
      const filtered = blogs.filter(b => b.id !== id);
      return writeJSONFile('blogs.json', filtered);
    }
    await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
    return true;
  },

  // Enquiries
  async getEnquiries() {
    if (useFallback) {
      return readJSONFile('enquiries.json', []);
    }
    const [rows] = await pool.query('SELECT * FROM enquiries ORDER BY date DESC');
    return rows;
  },
  async saveEnquiry(enquiry) {
    if (useFallback) {
      const enquiries = readJSONFile('enquiries.json', []);
      enquiries.unshift(enquiry);
      return writeJSONFile('enquiries.json', enquiries);
    }
    await pool.query(
      'INSERT INTO enquiries (id, name, phone, city, service, message, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [enquiry.id, enquiry.name, enquiry.phone, enquiry.city, enquiry.service, enquiry.message, enquiry.date]
    );
    return true;
  },

  // Banners
  async getBanners() {
    if (useFallback) {
      return readJSONFile('banners.json', []);
    }
    const [rows] = await pool.query('SELECT * FROM banners');
    return rows;
  },
  async saveBanner(banner) {
    if (useFallback) {
      const banners = readJSONFile('banners.json', []);
      const index = banners.findIndex(b => b.id === banner.id);
      if (index >= 0) {
        banners[index] = { ...banners[index], ...banner };
      } else {
        banners.push(banner);
      }
      return writeJSONFile('banners.json', banners);
    }
    const [rows] = await pool.query('SELECT id FROM banners WHERE id = ?', [banner.id]);
    if (rows.length > 0) {
      await pool.query(
        'UPDATE banners SET image = ?, title = ?, subtitle = ?, btn1Text = ?, btn1Url = ?, btn2Text = ?, btn2Url = ? WHERE id = ?',
        [banner.image, banner.title, banner.subtitle, banner.btn1Text || '', banner.btn1Url || '', banner.btn2Text || '', banner.btn2Url || '', banner.id]
      );
    } else {
      await pool.query(
        'INSERT INTO banners (id, image, title, subtitle, btn1Text, btn1Url, btn2Text, btn2Url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [banner.id, banner.image, banner.title, banner.subtitle, banner.btn1Text || '', banner.btn1Url || '', banner.btn2Text || '', banner.btn2Url || '']
      );
    }
    return true;
  },
  async deleteBanner(id) {
    if (useFallback) {
      const banners = readJSONFile('banners.json', []);
      const filtered = banners.filter(b => b.id !== id);
      return writeJSONFile('banners.json', filtered);
    }
    await pool.query('DELETE FROM banners WHERE id = ?', [id]);
    return true;
  }
};
