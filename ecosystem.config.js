module.exports = {
  apps: [
    {
      name: "api-ayni",
      script: "dist/main.js",
      cwd: "/home/webapp/projects/ayni/api_ayni",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 8008,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8008,
      },
    },
  ],
};
