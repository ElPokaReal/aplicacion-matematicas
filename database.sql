-- 1. Crear catálogo de recompensas y logros
INSERT INTO `recompensas` (`nombre`, `descripcion`, `costo_puntos`) VALUES
('Sticker Digital de Estrella', 'Un sticker brillante para tu colección.', 20),
('Fondo de Perfil de Cohete', 'Personaliza tu perfil con un tema espacial.', 50),
('Avatar de Robot Amigable', 'Un nuevo avatar para tu perfil.', 75),
('Tema Oscuro', 'Cambia la interfaz a un relajante tema oscuro.', 100);

INSERT INTO `logros` (`nombre`, `descripcion`, `tipo_logro`, `valor_requerido`, `criterio_adicional`, `puntos_otorgados`) VALUES
('Primeros Pasos', 'Completa tu primer ejercicio correctamente.', 'ejercicios_completados', 1, NULL, 10),
('Aprendiz Constante', 'Completa 5 ejercicios correctamente.', 'ejercicios_completados', 5, NULL, 25),
('Maestro de la Suma', 'Completa 10 ejercicios de suma correctamente.', 'ejercicios_por_grado', 10, 'Suma', 30),
('Cazador de Puntos', 'Acumula 100 puntos de recompensa.', 'puntos_acumulados', 100, NULL, 50),
('Explorador de Grados', 'Completa al menos un ejercicio en 3 grados diferentes.', 'grados_explorados', 3, NULL, 40);

-- No se simula la obtención de logros y compra de recompensas aquí, la lógica está en el backend.