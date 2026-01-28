# United Winners DT Board Portal

A modern, secure, and user-friendly board management system built with React, TypeScript, and Material-UI. This comprehensive portal supports role-based access control, meeting management, loan appraisal workflows, document management, voting systems, and analytics integration.

## 🎯 Project Overview

The United Winners DT Board Portal is designed to streamline board operations with three primary user roles:

1. **Administrator** - Manages users, meetings, documents, and monitors activity
2. **Board Member** - Views dashboards, participates in meetings, votes on resolutions, reviews loans
3. **Subcommittee Member** - Focused access to specific subcommittee documents and tasks

## ✨ Key Features

### 🔐 Authentication System
- Role-based authentication and authorization
- JWT token management (mock implementation)
- Protected routes based on user roles
- Session management with auto-logout
- Remember me functionality

### 📊 Dashboard System (Role-Based)
- **Administrator Dashboard**: System overview, user management, activity logs
- **Board Member Dashboard**: Calendar, pending tasks, metrics, recent documents
- **Subcommittee Dashboard**: Task-specific updates, subcommittee documents

### 📅 Meeting Management
- Meeting calendar and list views
- Agenda builder with document attachments
- Meeting preparation with downloadable materials
- Meeting details with tabs (Agenda, Attendees, Documents, Minutes)
- Action item tracking

### 💰 Loan Appraisal Workflow
- Loan application list with advanced filtering
- Detailed loan application viewer
- Subcommittee recommendation forms
- Board member final approval/rejection
- Loan portfolio analytics

### 📁 Document Management
- Centralized document repository
- Category-based organization
- Advanced search and filtering
- Document preview and viewer
- Version control structure
- Access audit trails

### 🗳️ Voting and Resolution System
- Create and manage resolutions
- Real-time and scheduled voting
- Anonymous or transparent voting options
- Vote casting with comments
- Results visualization with charts
- Complete audit trail

### 📈 Analytics and Insights
- Interactive charts using Recharts
- Key performance indicators
- Meeting attendance trends
- Loan portfolio metrics
- Power BI integration placeholder

### 👥 User Management (Admin Only)
- User CRUD operations
- Role assignment and management
- User activity tracking
- Bulk operations support

### 🔔 Notifications
- Toast notifications for user actions
- Real-time updates structure
- Success, error, and info messages

## 🛠️ Technology Stack

### Core
- **React 19.2** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool and dev server

### UI Framework
- **Material-UI (MUI) v7** - Enterprise UI components
- **Emotion** - CSS-in-JS styling
- **Material Icons** - Icon library

### State Management
- **React Context API** - Global state
- **useReducer** - Complex state logic

### Forms & Validation
- **React Hook Form 7.71** - Form management
- **Zod 4.3** - Schema validation

### Data Visualization
- **Recharts 3.7** - Charts and graphs

### Routing
- **React Router v7** - Client-side routing

### HTTP & Data
- **Axios 1.13** - HTTP client
- **date-fns 4.1** - Date manipulation

### Notifications
- **React-Toastify 11.0** - Toast notifications

## 📁 Project Structure

```
src/
├── assets/              # Images, logos, icons
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Button, Card, Modal, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, Footer)
│   └── features/       # Feature-specific components
├── contexts/           # React Context for state management
│   ├── AuthContext.tsx
│   ├── MeetingContext.tsx
│   ├── DocumentContext.tsx
│   └── VotingContext.tsx
├── hooks/              # Custom React hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── usePagination.ts
├── pages/              # Page-level components
│   ├── auth/          # Login
│   ├── dashboard/     # Admin, Board Member, Subcommittee dashboards
│   ├── meetings/      # Meeting List, Details, Preparation
│   ├── loans/         # Loan List, Appraisal, Details
│   ├── documents/     # Document Library, Viewer
│   ├── voting/        # Voting List, Create Resolution, Results
│   ├── analytics/     # Analytics Dashboard
│   └── users/         # User Management
├── services/           # API services and data fetching
│   ├── api.ts
│   ├── authService.ts
│   ├── meetingService.ts
│   ├── loanService.ts
│   ├── documentService.ts
│   ├── votingService.ts
│   └── userService.ts
├── types/              # TypeScript type definitions
│   ├── auth.types.ts
│   ├── meeting.types.ts
│   ├── loan.types.ts
│   ├── document.types.ts
│   ├── voting.types.ts
│   └── user.types.ts
├── utils/              # Utility functions
│   ├── constants.ts
│   ├── helpers.ts
│   └── validators.ts
├── routes/             # Route configuration
│   ├── AppRoutes.tsx
│   └── ProtectedRoute.tsx
├── theme/              # MUI theme configuration
│   └── theme.ts
├── mocks/              # Mock data for development
│   ├── users.mock.ts
│   ├── meetings.mock.ts
│   ├── loans.mock.ts
│   ├── documents.mock.ts
│   └── resolutions.mock.ts
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or later
- npm 9+ or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ngosakoech/my-react-app.git
cd my-react-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:5173
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔑 Mock Credentials

For testing purposes, use these mock credentials:

### Administrator
- **Email**: admin@uwdt.com
- **Password**: password123

### Board Member
- **Email**: board@uwdt.com
- **Password**: password123

### Subcommittee Member
- **Email**: subcommittee@uwdt.com
- **Password**: password123

**Note**: All mock users share the same password for simplicity in development.

## 🎨 Features Demonstration

### Role-Based Dashboards
Each user role sees a customized dashboard with relevant information and actions:
- Administrators see system metrics, user management, and activity logs
- Board Members see their calendar, pending votes, and meeting schedules
- Subcommittee Members see task-specific assignments and documents

### Meeting Management
- Create meetings with detailed agendas
- Attach documents to agenda items
- Track attendees and their responses
- Record and publish meeting minutes
- Assign action items with due dates

### Loan Appraisal Workflow
- Submit loan applications with supporting documents
- Subcommittee reviews and makes recommendations
- Board reviews subcommittee recommendations
- Final approval or rejection with audit trail
- Portfolio analytics and reporting

### Document Library
- Upload and categorize documents
- Advanced search with filters
- Version control
- Access logging
- Secure document preview

### Voting System
- Create resolutions with voting parameters
- Set quorum requirements
- Anonymous or transparent voting
- Real-time or scheduled results
- Export voting records

## 🔒 Security Features

- Role-based access control (RBAC)
- Protected routes with authentication
- Input validation using Zod schemas
- XSS protection
- Secure token storage
- API error handling
- Form validation on all inputs

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktops (1024px and up)
- 🖥️ Large screens (1920px and up)

## 🎨 Theme Customization

The application uses a custom Material-UI theme with:
- Professional blue primary color (#1565C0)
- Orange/gold secondary color (#F57C00)
- Custom typography (Inter/Roboto font family)
- Consistent spacing and shadows
- Dark mode support (structure in place)

## 🔌 API Integration

The application is structured to easily connect to a real backend API:

1. All service files are in `src/services/`
2. Mock data can be replaced with real API calls
3. Axios is configured with interceptors
4. Environment variables for API endpoints

To connect to a real API:
1. Update `VITE_API_BASE_URL` in `.env`
2. Replace mock data calls in service files with real API calls
3. Update authentication service with real JWT handling

## 📚 Documentation

Additional documentation available:
- `TYPES_AND_MOCKS_README.md` - Type definitions and mock data guide
- `PAGES_README.md` - Page components documentation
- Inline code comments throughout the codebase

## 🧪 Development Guidelines

### Code Quality
- TypeScript strict mode enabled
- ESLint for code linting
- Consistent naming conventions
- Component-based architecture

### Performance
- Lazy loading for routes
- Code splitting
- Memoization where appropriate
- Optimized bundle sizes

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation support
- Screen reader friendly

## 🚧 Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Email notification system
- [ ] Advanced reporting and exports
- [ ] Mobile app (React Native)
- [ ] Offline mode with service workers
- [ ] Internationalization (i18n)
- [ ] Calendar integrations (Google, Outlook)
- [ ] E-signature integration for documents
- [ ] Advanced audit logs and compliance reports
- [ ] Two-factor authentication
- [ ] Single Sign-On (SSO)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **United Winners DT Board Portal Team**

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- React team for the amazing framework
- All contributors and testers

## 📞 Support

For support, please contact:
- Email: support@unitedwinners.com
- Issue Tracker: GitHub Issues

---

**Built with ❤️ using React, TypeScript, and Material-UI**
