import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'SICIP Portal';

const routeMap = {
    'sicip.create': '/sicip/feasibility-report',
    'sicip.store': '/sicip/feasibility-report',
    'sicip.index': '/sicip/reports',
    'sicip.show': (param) => `/sicip/report/${param}`,
    'dashboard': '/dashboard',
    'login': '/login',
    'logout': '/logout',
    'requests.index': '/requests',
    'payments.index': '/payments',
    'admin.users': '/admin/users',
    'admin.audit-logs': '/admin/audit-logs',
};

window.route = function (name, params) {
    if (routeMap[name]) {
        return typeof routeMap[name] === 'function' ? routeMap[name](params) : routeMap[name];
    }
    return `/${name.replace(/\./g, '/')}`;
};

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        const page = pages[`./Pages/${name}.jsx`];
        if (!page) {
            throw new Error(`Page not found: ./Pages/${name}.jsx`);
        }
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#2563eb',
        showSpinner: true,
    },
});

