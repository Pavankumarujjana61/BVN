-- MySQL Dump for BVN Modulars Database
-- Hostinger phpMyAdmin Import Compatible SQL Script

CREATE DATABASE IF NOT EXISTS `bvn_db`;
USE `bvn_db`;

-- --------------------------------------------------------
-- Table structure for table `admins`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `admins`
INSERT INTO `admins` (`username`, `password`) VALUES
('admin', 'baa1886bf60bbd62ea281e109eb0fe82b8ffd8bc32a8b2c051882227d5414704');

-- --------------------------------------------------------
-- Table structure for table `banners`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `banners` (
  `id` VARCHAR(100) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` TEXT NOT NULL,
  `btn1Text` VARCHAR(100) NOT NULL,
  `btn1Url` VARCHAR(255) NOT NULL,
  `btn2Text` VARCHAR(100) NOT NULL,
  `btn2Url` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `banners`
INSERT INTO `banners` (`id`, `image`, `title`, `subtitle`, `btn1Text`, `btn1Url`, `btn2Text`, `btn2Url`) VALUES
('banner-1', '/images/hero_kitchen.webp', 'Factory-Made Modular Interiors — Delivered to Your Door in Rajahmundry', 'Custom Kitchens, Wardrobes, TV Units & More — Designed in 3D, Built in Our Own Factory', 'Get Free 3D Design Consultation', '#contact-form', 'View Our Projects', '/projects'),
('banner-2', '/images/project_wardrobe.webp', 'Sleek Sliding Wardrobes & Loft Storage Solutions', 'Maximize your bedroom space with moisture-sealed drawers and custom wardrobes built in our factory.', 'Get Free 3D Design Consultation', '#contact-form', 'View Our Projects', '/projects'),
('banner-3', '/images/project_tv_unit.webp', 'Stunning Backlit TV Units & Louver Panels', 'Transform your living room with premium floating consoles and ambient LED lighting strips.', 'Get Free 3D Design Consultation', '#contact-form', 'View Our Projects', '/projects');

-- --------------------------------------------------------
-- Table structure for table `blogs`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `summary` TEXT NOT NULL,
  `content` MEDIUMTEXT NOT NULL,
  `date` VARCHAR(100) NOT NULL,
  `metaTitle` VARCHAR(255) NOT NULL,
  `metaDescription` TEXT NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `blogs`
INSERT INTO `blogs` (`id`, `title`, `summary`, `content`, `date`, `metaTitle`, `metaDescription`, `image`) VALUES
('5-things-before-buying-modular-kitchen-rajahmundry', '5 Things to Know Before Buying a Modular Kitchen in Rajahmundry', 'Planning a new modular kitchen in Rajahmundry? Here are the top 5 factors to consider, from layout types to selecting waterproof marine ply for long durability.', '<p>When planning a kitchen renovation, most homeowners in Rajahmundry focus entirely on aesthetics. However, the performance and lifetime of your modular kitchen depend on structural choices. Here are 5 critical things to know before making a purchase:</p><h3>1. Core Material Matters (Commercial Marine Ply)</h3><p>Indian kitchens involve extensive water usage and high humidity. Avoid MDF or Particle Board, as they swell and disintegrate when exposed to water. Always choose high-grade waterproof marine plywood (BWP grade) for the cabinets to ensure durability.</p><h3>2. Layout Types for Your Space</h3><p>Choose your layout carefully depending on floor area: L-shape kitchens are excellent for maximizing corner space, straight kitchens fit small apartments, and U-shape or island configurations work wonders for large rooms.</p><h3>3. The Golden Triangle Rule</h3><p>Keep your sink, stove, and refrigerator within a comfortable distance. This layout principle reduces unnecessary movement and makes cooking far more efficient.</p><h3>4. Factory-Made vs. Carpenter-Built</h3><p>Factory-made furniture ensures precise CNC cutting to 0.1mm accuracy. Edge-banding machines apply ABS tape under heat and pressure, sealing boards completely from moisture—something a hand-glued carpenter finish can never match.</p><h3>5. Hardware and Fittings</h3><p>Fittings like hinges, drawers, and pull-outs are used daily. Trust premium brands like Hettich, Blum, or Hafele for smooth soft-close mechanics that survive decades.</p>', 'June 15, 2026', 'Modular kitchen Rajahmundry | 5 Buying Tips | BVN Modulars', 'Planning a modular kitchen in Rajahmundry? Learn the top 5 layout, ply, and material tips to build a durable kitchen. Get a free 3D quote today!', '/images/project_kitchen.webp'),
('why-factory-made-furniture-better-carpenter-ap', 'Why Factory-Made Furniture is Better than Carpenter-Made in Andhra Pradesh', 'Discover why modern homeowners in Andhra Pradesh are choosing factory-made modular furniture over manual site carpentry for their interiors.', '<p>Choosing between factory-made modular furniture and hiring local carpenters is one of the biggest dilemmas homeowners face during interior work in Andhra Pradesh. Let us look at why factory-made modular units are superior in quality, speed, and durability.</p><h3>1. Unmatched Precision with CNC Cutting</h3><p>Local carpenters use manual saws, which can lead to human error, uneven edges, and structural misalignments. In contrast, our modern factory utilizes high-tech CNC Router Machines that cut boards with 0.1mm accuracy. Every cabinet and drawer fits perfectly without any guesswork or on-site adjustments.</p><h3>2. High-Quality Edge Banding</h3><p>Exposed wood panels absorb moisture and expand. Local carpenters paste edge tapes by hand using standard glue, which peels off in a few years. Our factory-made furniture uses automated Edge Banding Machines that hot-press ABS or PVC tape, creating a seamless seal against moisture and wear.</p><h3>3. Zero Hassle and Dust-Free Home</h3><p>Carpenter work creates massive dust, noise, and chaos in your home for months. With factory-built modular furniture, all components are manufactured, pre-drilled, and finished at our plant. Our installation crew dry-assembles them at the factory before transporting them to your house, completing the final assembly in just 3-5 days.</p><h3>4. Durable Hot-Press Laminates</h3><p>Manual gluing of laminates often results in air bubbles and uneven bonding over time. In our factory, we use heavy Laminate Presses that bond sheets under controlled heat and high pressure. This makes the laminate incredibly durable and heat-resistant.</p><h3>5. Clear Pricing and Timeline Guarantee</h3><p>Carpenter projects often run over budget and overshoot deadlines due to material waste and labor delays. BVN Modulars provides fixed package pricing and commits to clear timelines from design to installation.</p>', 'June 18, 2026', 'Factory Modular Furniture AP | Factory vs Carpenter | BVN', 'Discover why factory-made modular furniture is superior to carpenter work. Precision CNC cut and moisture-sealed edge banding. Read more now!', '/images/factory_cnc.webp');

-- --------------------------------------------------------
-- Table structure for table `enquiries`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `city` VARCHAR(255) NOT NULL,
  `service` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `date` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `enquiries`
INSERT INTO `enquiries` (`id`, `name`, `phone`, `city`, `service`, `message`, `date`) VALUES
('1781932239746', 'pavan', '8790616976', 'cvwucvwbiecn;ekc', 'TV Unit & Louvers', 'rtdytutyuoipuy', '2026-06-20T05:10:39.746Z'),
('1781866347106', 'pavan', '8790616976', 'cvwucvwbiecn;ekc', 'Modular Kitchen', 'hacdgagcshos', '2026-06-19T10:52:27.106Z'),
('1781859584525', 'Test Customer', '9999999999', 'Rajahmundry', 'Modular Kitchen', 'Test message', '2026-06-19T08:59:44.525Z');

-- --------------------------------------------------------
-- Table structure for table `pricing`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pricing` (
  `id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `startingPrice` VARCHAR(50) NOT NULL,
  `priceUnit` VARCHAR(50) NOT NULL,
  `inclusions` TEXT NOT NULL,
  `isPopular` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `pricing`
INSERT INTO `pricing` (`id`, `name`, `startingPrice`, `priceUnit`, `inclusions`, `isPopular`) VALUES
('1bhk-starter', '1BHK Starter Package', '1.25', 'Lakhs', '[\"Modular kitchen (straight)\",\"1 wardrobe\",\"Basic hardware\",\"Standard laminate selection\"]', 0),
('2bhk-value', '2BHK Value Package', '3', 'Lakhs', '[\"L-shape kitchen\",\"2 wardrobes\",\"TV unit\",\"Crockery unit\",\"Hettich soft-close hinges & runners\",\"30+ laminate options\"]', 1),
('3bhk-premium', '3BHK Premium Package', '3.80', 'Lakhs', '[\"U-shape / island kitchen\",\"All bedroom wardrobes\",\"TV unit\",\"Crockery unit\",\"Premium bedroom furniture\",\"Hafele hardware\"]', 0);

-- --------------------------------------------------------
-- Table structure for table `projects`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `projects`
INSERT INTO `projects` (`id`, `title`, `category`, `location`, `image`, `description`) VALUES
('project-kitchen-acrylic', 'Premium Acrylic L-Shape Kitchen', 'modular-kitchens', 'Rajahmundry', '/images/project_kitchen.webp', 'Stunning high-gloss acrylic modular kitchen in L-shape layout with premium soft-close Tandem boxes, profile handles, and integrated chimney.'),
('project-wardrobe-sliding', 'Modern Sliding Wardrobe with Loft', 'wardrobes', 'Rajahmundry', '/images/project_wardrobe.webp', 'Sleek 3-door sliding wardrobe with customized internal layouts, drawer organizers, and overhead loft cabinets for maximum storage.'),
('project-tv-floating', 'Floating TV Console with Backlit Louvers', 'tv-units', 'Rajahmundry', '/images/project_tv_unit.webp', 'Elegant floating media console with Charcoal louver paneling, Warm Amber LED strip backlighting, and wood drawer fronts.'),
('project-bedroom-suite', 'Master Bedroom Furniture Suite', 'bedrooms', 'Rajahmundry', '/images/project_bedroom.webp', 'Complete bedroom ensemble including a King size bed with customized headboard, bedside tables, and a dressing vanity unit.'),
('project-crockery-showcase', 'Crockery Unit & Kitchen Display Cabinet', 'crockery-units', 'Rajahmundry', '/images/project_crockery.webp', 'Tall display cabinet with glass doors, internal spot lighting, and bottom storage drawers for premium dining room elegance.'),
('project-office-workstation', 'Ergonomic Corporate Office Interiors', 'office-interiors', 'Rajahmundry', '/images/project_office.webp', 'Efficient and clean office setup featuring modular workstations, executive desks, conference tables, and storage walls.');

-- --------------------------------------------------------
-- Table structure for table `testimonials`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` VARCHAR(100) NOT NULL,
  `customerName` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` INT NOT NULL,
  `customerPhoto` VARCHAR(255) NOT NULL,
  `projectPhoto` VARCHAR(255) NOT NULL,
  `text` TEXT NOT NULL,
  `serviceType` VARCHAR(255) NOT NULL,
  `videoEmbed` TEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `testimonials`
INSERT INTO `testimonials` (`id`, `customerName`, `location`, `rating`, `customerPhoto`, `projectPhoto`, `text`, `serviceType`, `videoEmbed`) VALUES
('testimonial-priya-reddy', 'Priya Reddy', 'Innispeta, Rajahmundry', 5, '/images/customer_priya.svg', '/images/project_kitchen.webp', 'BVN Modulars transformed our kitchen into a masterclass. The CNC cutting and edge-banding work are absolutely flawless. Our kitchen works beautifully!', 'Modular Kitchen — L-Shape with Island, Rajahmundry', ''),
('testimonial-suresh-kumar', 'Suresh Kumar', 'Danavaipeta, Rajahmundry', 5, '/images/customer_suresh.svg', '/images/project_tv_unit.webp', 'Extremely professional service. From 3D design to factory finish to final setup, everything was seamless and completed in 20 days. Best modular furniture in AP.', 'TV Unit Design, Rajahmundry', ''),
('testimonial-anitha-rao', 'Anitha Rao', 'T-Nagar, Rajahmundry', 5, '/images/customer_anitha.svg', '/images/project_wardrobe.webp', 'The sliding wardrobes with lofts are super spacious and durable. Their Hettich soft-close fittings work smoothly. Highly recommend their factory-made quality.', 'Wardrobe with Loft, Rajahmundry', '');
