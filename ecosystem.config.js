module.exports = {
  apps: [
    {
      name: "api-wyni-x2",
      script: "node_modules/.bin/next",
      args: "start",
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
