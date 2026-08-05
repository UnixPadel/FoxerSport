module.exports = {
  apps: [
    {
      name: "foxersport-api",
      script: "./src/server.js",
      instances: "max", // Lance autant d'instances qu'il y a de cœurs CPU disponibles
      exec_mode: "cluster", // Active le mode cluster (multi-threading natif)
      watch: false, // En production, on ne veut pas relancer au moindre changement de fichier
      max_memory_restart: "500M", // Redémarre l'instance si elle consomme trop de RAM (prévention des fuites mémoire)
      env: {
        NODE_ENV: "production", // Définit l'environnement sur production
      },
      env_development: {
        NODE_ENV: "development",
      }
    }
  ]
};
