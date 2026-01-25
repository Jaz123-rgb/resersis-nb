This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Estructura del Proyecto

```
resersis-nb/
├── app/                  # Carpeta principal de Next.js
│   ├── api/              # Llamadas a la API
│   │   ├── services/     # Servicios para consumir la API
│   │   └── utils/        # Utilidades relacionadas con la API
│   ├── components/       # Componentes reutilizables
│   │   ├── ui/           # Componentes de interfaz de usuario (botones, inputs, etc.)
│   │   └── layout/       # Componentes de diseño (headers, footers, etc.)
│   ├── pages/            # Páginas del proyecto
│   └── styles/           # Archivos de estilos globales o específicos
├── public/               # Archivos estáticos (imágenes, fuentes, etc.)
├── utils/                # Funciones y helpers generales
├── hooks/                # Custom hooks
├── constants/            # Constantes globales (URLs, configuraciones, etc.)
└── types/                # Definiciones de tipos (TypeScript)
```

## Descripción de las carpetas

### `app/`
- **`api/`**: Contiene todo lo relacionado con las llamadas a la API.
  - **`services/`**: Servicios para consumir la API.
  - **`utils/`**: Utilidades relacionadas con la API.
- **`components/`**: Componentes reutilizables.
  - **`ui/`**: Componentes de interfaz de usuario como botones, inputs, etc.
  - **`layout/`**: Componentes de diseño como headers, footers, etc.
- **`pages/`**: Contiene las páginas del proyecto.
- **`styles/`**: Archivos de estilos globales o específicos.

### `public/`
- Archivos estáticos como imágenes, íconos, etc.

### `utils/`
- Funciones y helpers generales que pueden ser utilizados en todo el proyecto.

### `hooks/`
- Custom hooks para encapsular lógica reutilizable.

### `constants/`
- Constantes globales como URLs de la API o configuraciones.

### `types/`
- Definiciones de tipos para TypeScript.