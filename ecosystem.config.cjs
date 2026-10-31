
module.exports = {
  apps: [
    {
      name: "ecommerce-staging",
      script: "src/server.js",
      cwd: "/root/ecommerce_project_prod_1",
      node_args: "--env-file=/root/ecommerce_project_prod_1/.env",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
