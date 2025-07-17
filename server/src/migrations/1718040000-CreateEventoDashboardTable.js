module.exports = class CreateEventoDashboardTable1718040000 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE eventos_dashboard (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL,
        descripcion VARCHAR(255) NOT NULL,
        estudiante_id INT,
        grado INT,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT FK_evento_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query('DROP TABLE IF EXISTS eventos_dashboard');
  }
}; 