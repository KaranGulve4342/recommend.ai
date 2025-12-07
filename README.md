# 🎯 RecommendAI

<div align="center">

![RecommendAI Logo](public/icon.svg)

**AI-Powered E-commerce Product Recommendation System**

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-integration) • [Documentation](#-documentation)

</div>

---

## 📖 About

RecommendAI is a modern, full-stack web application that provides intelligent product recommendations for e-commerce platforms. Built with Next.js 16 and powered by machine learning algorithms, it analyzes user behavior patterns and product similarities to deliver personalized recommendations with AI-generated explanations.

### 🎯 Key Highlights

- **AI-Powered Recommendations** - Advanced ML algorithms analyze user behavior and product data
- **Real-time Analytics** - Track user interactions and generate insights instantly
- **Beautiful UI/UX** - Modern, responsive design with a sleek purple theme
- **Full CRUD Operations** - Complete product catalog and behavior management
- **CSV Upload Support** - Bulk import products and user behavior data
- **LLM Explanations** - AI-generated insights for each recommendation
- **TypeScript First** - Fully typed for better developer experience

---

## ✨ Features

### 📦 Product Catalog Management
- ✅ Upload CSV files with product data
- ✅ Add, edit, and delete products in real-time
- ✅ Search and filter products by category, brand, or name
- ✅ Category badges for easy identification
- ✅ Automatic synchronization with backend API
- ✅ Product statistics and analytics dashboard

### 👤 User Behavior Tracking
- ✅ Upload CSV files with user interaction data
- ✅ Track multiple action types: view, add_to_cart, purchase
- ✅ Add, edit, and delete behavior entries
- ✅ Search and filter behavior records
- ✅ Real-time statistics (active users, total actions, purchases)
- ✅ Timestamp-based tracking

### 🎯 AI Recommendations
- ✅ Generate personalized product recommendations per user
- ✅ View stored recommendations from database
- ✅ LLM-generated explanations for recommendations
- ✅ Filter by Top N recommendations
- ✅ Sort by price, rating, similarity score, or overall score
- ✅ Search recommendations by product name or brand
- ✅ Visual confidence scores and similarity metrics

### 🎨 Modern UI/UX
- ✅ Beautiful purple-themed interface
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Toast notifications for user feedback
- ✅ Loading states and skeleton screens
- ✅ Error handling with helpful messages
- ✅ Accessible components (WCAG compliant)
- ✅ Dark mode support

---

## 🚀 Demo

### Dashboard Screenshots

<details>
<summary>Click to view screenshots</summary>

#### Product Catalog
![Product Catalog](docs/screenshots/catalog.png)

#### User Behavior
![User Behavior](docs/screenshots/behavior.png)

#### Recommendations
![Recommendations](docs/screenshots/recommendations.png)

</details>

### Live Demo
🔗 [View Live Demo](https://recommendai.vercel.app) *(Coming Soon)*

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.0.7](https://nextjs.org/) with App Router
- **UI Library**: [React 19.2.0](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.1.9](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### Backend API Integration
- **API Client**: Native Fetch with TypeScript
- **Data Format**: JSON + CSV upload support
- **Error Handling**: Comprehensive error boundaries
- **State Management**: React Hooks

### Development Tools
- **Build Tool**: [Turbopack](https://turbo.build/)
- **Linting**: [ESLint](https://eslint.org/)
- **Package Manager**: npm
- **Version Control**: Git

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17 or later ([Download](https://nodejs.org/))
- **npm** 9.0 or later (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/KaranGulve4342/recommend.ai.git
cd recommend.ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure your API URL:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

For local development:
```env                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run Development Server                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 📖 Usage

### Uploading Data

#### 1. Upload Product Catalog

Navigate to the **Product Catalog** page and click "Upload Data":

**CSV Format:**
```csv
product_id,name,brand,category,price,rating,features
P001,Wireless Headphones,SoundMax,Electronics,2999,4.5,Noise Cancellation;40hrs Battery;Foldable
P002,Smart Watch,FitTrack,Wearables,5499,4.3,Heart Rate Monitor;GPS;Waterproof
```

#### 2. Upload User Behavior

Navigate to the **User Behaviour** page and click "Upload Data":

**CSV Format:**
```csv
user_id,product_id,action,timestamp
U001,P001,view,2025-12-07 10:30:00
U001,P001,add_to_cart,2025-12-07 10:35:00
U001,P001,purchase,2025-12-07 10:40:00
```

**Supported Actions:**
- `view` - User viewed the product
- `add_to_cart` - User added product to cart
- `purchase` - User purchased the product

### Generating Recommendations

1. Navigate to **Recommendations** page
2. Enter a User ID (e.g., `U001`)
3. Click **"Load Stored"** to view existing recommendations
4. Click **"Generate New"** to create fresh recommendations with AI explanations

---

## 🔌 API Integration

The frontend integrates with a FastAPI backend. All 14 API endpoints are fully integrated:

### Recommendations APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/products` | Upload products CSV |
| POST | `/api/upload/user-behavior` | Upload user behavior CSV |
| GET | `/api/recommendations/{user_id}` | Generate recommendations |
| GET | `/api/recommendations/stored/{user_id}` | Get stored recommendations |

### Products APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products/add_product` | Add new product |
| GET | `/products/get_products` | Get all products |
| GET | `/products/get_product_id/{product_id}` | Get product by ID |
| PUT | `/products/update_product/{product_id}` | Update product |
| DELETE | `/products/delete_product/{product_id}` | Delete product |

### User Behavior APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/behavior/add_behavior` | Add behavior record |
| GET | `/behavior/get_behaviors` | Get all behaviors |
| GET | `/behavior/get_behavior/{behavior_id}` | Get behavior by ID |
| PUT | `/behavior/update_behavior/{behavior_id}` | Update behavior |
| DELETE | `/behavior/delete_behavior/{behavior_id}` | Delete behavior |

**📚 Full API Documentation:** See [API_INTEGRATION.md](./API_INTEGRATION.md)

---

## 📁 Project Structure

```
recommendai/
├── app/                          # Next.js App Router
│   ├── dashboard/                # Dashboard pages
│   │   ├── catalog/              # Product catalog management
│   │   ├── behaviour/            # User behavior tracking
│   │   ├── recommendations/      # AI recommendations
│   │   └── layout.tsx            # Dashboard layout
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── ui/                       # Shadcn UI components
│   ├── app-sidebar.tsx           # Navigation sidebar
│   ├── editable-table.tsx        # Data table with CRUD
│   ├── file-uploader.tsx         # CSV file uploader
│   ├── navbar.tsx                # Navigation bar
│   ├── pagination.tsx            # Pagination component
│   └── upload-dialog.tsx         # Upload dialog
├── lib/                          # Utilities and helpers
│   ├── api.ts                    # API client (14 endpoints)
│   ├── mock-data.ts              # Mock data for development
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utility functions
├── hooks/                        # Custom React hooks
│   └── use-mobile.tsx            # Mobile detection hook
├── public/                       # Static assets
│   ├── icon.svg                  # App icon
│   └── ...
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment variables
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── next.config.ts                # Next.js configuration
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Purple (`oklch(0.541 0.281 293.009)`)
- **Background**: White / Dark Gray
- **Accent**: Light Purple
- **Text**: Dark Gray / White

### Typography
- **Font**: Outfit (Google Fonts)
- **Weights**: 100-900

### Components
All UI components are built with [Radix UI](https://www.radix-ui.com/) primitives and styled with Tailwind CSS.

---

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KaranGulve4342/recommend.ai)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Deploy to Other Platforms

<details>
<summary>Netlify</summary>

```bash
npm run build
# Deploy the .next folder
```
</details>

<details>
<summary>Docker</summary>

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t recommendai .
docker run -p 3000:3000 recommendai
```
</details>

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

---

## 📝 Documentation

- **[API Integration Guide](./API_INTEGRATION.md)** - Complete API documentation
- **[Quick Reference](./API_QUICK_REFERENCE.md)** - API quick reference card
- **[Integration Summary](./INTEGRATION_COMPLETE.md)** - Integration status

---

## 🐛 Troubleshooting

### Common Issues

<details>
<summary>API Connection Errors</summary>

**Problem:** Cannot connect to API

**Solution:**
1. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
2. Verify API is running
3. Check network connectivity
4. Ensure CORS is configured on backend
</details>

<details>
<summary>Build Errors</summary>

**Problem:** Build fails

**Solution:**
1. Delete `.next` folder: `rm -rf .next`
2. Clear node modules: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`
</details>

<details>
<summary>CSV Upload Fails</summary>

**Problem:** CSV file upload returns error

**Solution:**
1. Check CSV format matches expected schema
2. Ensure all required columns are present
3. Verify file encoding is UTF-8
4. Check file size (backend may have limits)
</details>

---

## 📊 Performance

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 95+
- **Build Size**: Optimized with Turbopack
- **Bundle Analysis**: Tree-shaking enabled

---

## 🔒 Security

- Environment variables for sensitive data
- Input validation on all forms
- XSS protection built-in (React)
- CSRF protection via Next.js
- Secure API communication (HTTPS)
- No sensitive data in client-side code

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Karan Gulve**
- GitHub: [@KaranGulve4342](https://github.com/KaranGulve4342)
- LinkedIn: [Karan Gulve](https://linkedin.com/in/karangulve4342)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Vercel](https://vercel.com/) - Hosting platform
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Shadcn/ui](https://ui.shadcn.com/) - Component inspiration
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Lucide](https://lucide.dev/) - Beautiful icons

---

## 📞 Support

Need help? Here's how to get support:

- 📧 Email: karangulve@gmail.com
- 🐛 [Report a Bug](https://github.com/KaranGulve4342/recommend.ai/issues)
- 💡 [Request a Feature](https://github.com/KaranGulve4342/recommend.ai/issues)
- 📖 [Documentation](./API_INTEGRATION.md)

---

## 🗺️ Roadmap

- [ ] User authentication and authorization
- [ ] Real-time recommendations via WebSockets
- [ ] Advanced filtering and search
- [ ] Export recommendations to PDF/Excel
- [ ] A/B testing for recommendations
- [ ] Analytics dashboard with charts
- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Recommendation API SDK

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=KaranGulve4342/recommend.ai&type=Date)](https://star-history.com/#KaranGulve4342/recommend.ai&Date)

---

<div align="center">

**Made with ❤️ and ☕ by [Karan Gulve](https://github.com/KaranGulve4342)**

If you found this project helpful, please consider giving it a ⭐!

[Back to Top](#-recommendai)

</div>
