# Contributing to Enhanced Visual Design

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git
- A modern code editor (VS Code recommended)

### Development Setup
1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/vite-react-typescript-starter.git
   cd vite-react-typescript-starter
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/vite-react-typescript-starter.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Start development server**:
   ```bash
   npm run dev
   ```

### Recommended VS Code Extensions
- ESLint
- Prettier
- TypeScript Importer
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer

## Development Workflow

### Branch Strategy
We use a simplified Git flow:
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Critical production fixes

### Branch Naming Convention
```
[type]/[ticket-number]-[short-description]

Examples:
feature/PROJ-123-user-authentication
bugfix/PROJ-456-header-responsive-issue
hotfix/PROJ-789-security-patch
```

### Workflow Steps
1. **Create a feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/PROJ-123-new-feature
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes** using conventional commits

5. **Push to your fork**:
   ```bash
   git push origin feature/PROJ-123-new-feature
   ```

6. **Create a Pull Request** to the `develop` branch

## Coding Standards

### TypeScript Guidelines
- Use strict TypeScript configuration
- Define explicit types for all function parameters and return values
- Use interfaces for object shapes
- Prefer `type` for unions and primitives
- Use generic types where appropriate

```typescript
// Good
interface UserProps {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<UserProps> => {
  // implementation
};

// Avoid
const getUser = async (id) => {
  // implementation
};
```

### React Guidelines
- Use functional components with hooks
- Prefer composition over inheritance
- Use descriptive component and prop names
- Extract custom hooks for reusable logic
- Use React.memo() for performance optimization when needed

```typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'small' | 'medium' | 'large';
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, size, onClick, children }) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### CSS/Tailwind Guidelines
- Use Tailwind utility classes primarily
- Group related classes logically
- Use custom CSS sparingly and document when necessary
- Follow mobile-first responsive design
- Maintain consistent spacing using Tailwind's spacing scale

```typescript
// Good - Grouped and readable
<div className="
  flex items-center justify-center
  w-full h-screen
  bg-gradient-to-br from-blue-500 to-purple-600
  text-white font-semibold
">

// Avoid - Hard to read
<div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
```

### File Organization
- Use PascalCase for component files: `MyComponent.tsx`
- Use camelCase for utility files: `formatUtils.ts`
- Use kebab-case for non-component files: `api-client.ts`
- Co-locate related files (component, test, styles)
- Use barrel exports (`index.ts`) for clean imports

### Import Organization
```typescript
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// 2. Internal utilities and hooks
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatDate } from '../utils/dateUtils';

// 3. Components
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';

// 4. Types
import type { User, ApiResponse } from '../types';
```

## Commit Guidelines

### Conventional Commits
We use [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates

### Examples
```bash
feat(auth): add user login functionality
fix(header): resolve responsive navigation issue
docs(readme): update installation instructions
style(button): improve hover state animations
refactor(utils): extract common date formatting logic
perf(images): optimize image loading with lazy loading
test(auth): add unit tests for login component
chore(deps): update React to version 18.2.0
```

## Pull Request Process

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] All tests pass locally
- [ ] Documentation updated if necessary
- [ ] No console.log statements in production code

### PR Title Format
Use the same format as commit messages:
```
feat(component): add new feature description
```

### PR Description Template
Use the provided PR template and fill out all relevant sections:
- Description of changes
- Type of change
- Testing performed
- Screenshots (if UI changes)
- Breaking changes (if any)

### Review Process
1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by at least one maintainer
3. **Manual testing** if UI changes are involved
4. **Approval** from project maintainer
5. **Merge** to develop branch

### Review Criteria
- Functionality works as intended
- Code quality and maintainability
- Performance impact
- Security considerations
- Accessibility compliance
- Documentation completeness

## Issue Reporting

### Bug Reports
Use the bug report template and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment information
- Screenshots/videos if applicable
- Console errors

### Feature Requests
Use the feature request template and include:
- Clear description of the feature
- Use cases and benefits
- Acceptance criteria
- Design mockups (if applicable)
- Technical considerations

### Issue Labels
- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high/medium/low`: Issue priority
- `status: in progress`: Currently being worked on

## Testing Guidelines

### Testing Strategy
- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Visual Tests**: Test UI appearance and responsiveness

### Writing Tests
```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Coverage
- Aim for 80%+ test coverage
- Focus on critical business logic
- Test edge cases and error conditions
- Include accessibility tests

## Getting Help

### Communication Channels
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: [maintainer-email] for private concerns

### Documentation
- **README.md**: Project overview and setup
- **API Documentation**: Component and function documentation
- **Architecture Documentation**: System design and patterns

### Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

## Recognition

Contributors will be recognized in:
- **CONTRIBUTORS.md**: List of all contributors
- **Release Notes**: Major contributions highlighted
- **GitHub Contributors**: Automatic recognition

Thank you for contributing to Enhanced Visual Design! 🎉