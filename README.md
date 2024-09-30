# Linkedin Clone
<img style="width: 100%" src="https://github.com/yunyoungsik/Linkedin-Clone/blob/main/frontend/public/thumnail.png?raw=true" />

[참고영상](https://youtu.be/Ycg48pVp3SU?si=SwV9RpdomWcs3mDO)

## backend
```
mkdir linkedin
cd linkedin
code -r .
npm init -y
npm i express mongoose dotenv mailtrap jsonwebtoken cookie-parser bcryptjs cloudinary
npm i nodemon -D
npm i cors
```

package.json
```
"type": "module",
  "scripts": {
    "dev": "nodemon backend/server.js",
    "start": "node backend/server.js"
  },
```

## frontend
```
npm create vite@latest .
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm i -D daisyui@latest
npm i react-router-dom
npm i @tanstack/react-query
npm i axios react-hot-toast
npm i lucide-react
npm i date-fns
```

```
eslint.config.js에 react/prop-types를 off로 적용
 rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "react/prop-types": "off"
    },
```
