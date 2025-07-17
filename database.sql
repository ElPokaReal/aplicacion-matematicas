-- --- DATOS DE EJEMPLO ---

-- 1. Crear un profesor
INSERT INTO `maestros` (`nombre`, `email`, `password_hash`) VALUES ('Profesor Robles', 'profe.robles@example.com', 'hash_seguro_aqui');
SET @maestro_id = LAST_INSERT_ID();

-- 2. Registrar estudiantes
INSERT INTO `estudiantes` (`nombre`, `usuario`, `password_hash`, `grado`, `maestro_id`, `puntos_recompensa`) VALUES
('Ana Gómez', 'anag', 'hash_seguro_aqui', '1er Grado', @maestro_id, 50),
('Luis Castro', 'luisc', 'hash_seguro_aqui', '2do Grado', @maestro_id, 100);

-- 3. Crear ejercicios
INSERT INTO `ejercicios` (`grado`, `tipo_operacion`, `pregunta`, `respuesta_correcta`, `creado_por_maestro_id`) VALUES
('1er Grado', 'Suma', '7 + 5', '12', @maestro_id),
('1er Grado', 'Resta', '10 - 4', '6', @maestro_id),
('2do Grado', 'Multiplicación', '8 x 3', '24', @maestro_id);

-- 4. Simular progreso
INSERT INTO `progreso_estudiantes` (`estudiante_id`, `ejercicio_id`, `respuesta_enviada`, `es_correcta`) VALUES
(1, 1, '12', 1), (1, 2, '5', 0), (2, 3, '24', 1);

-- 5. Crear catálogo de recompensas y logros
INSERT INTO `recompensas` (`nombre`, `descripcion`, `costo_puntos`, `url_imagen`) VALUES
('Sticker Digital de Estrella', 'Un sticker brillante para tu colección.', 20, '/icons/star_sticker.png'),
('Fondo de Perfil de Cohete', 'Personaliza tu perfil con un tema espacial.', 50, '/backgrounds/rocket.png'),
('Avatar de Robot Amigable', 'Un nuevo avatar para tu perfil.', 75, '/avatars/robot.png'),
('Tema Oscuro', 'Cambia la interfaz a un relajante tema oscuro.', 100, '/themes/dark.png');

INSERT INTO `logros` (`nombre`, `descripcion`, `tipo_logro`, `valor_requerido`, `criterio_adicional`, `puntos_otorgados`, `icono_url`) VALUES
('Primeros Pasos', 'Completa tu primer ejercicio correctamente.', 'ejercicios_completados', 1, NULL, 10, '/achievements/first_steps.png'),
('Aprendiz Constante', 'Completa 5 ejercicios correctamente.', 'ejercicios_completados', 5, NULL, 25, '/achievements/apprentice.png'),
('Maestro de la Suma', 'Completa 10 ejercicios de suma correctamente.', 'ejercicios_por_grado', 10, 'Suma', 30, '/achievements/addition_master.png'),
('Cazador de Puntos', 'Acumula 100 puntos de recompensa.', 'puntos_acumulados', 100, NULL, 50, '/achievements/point_hunter.png'),
('Explorador de Grados', 'Completa al menos un ejercicio en 3 grados diferentes.', 'grados_explorados', 3, NULL, 40, '/achievements/grade_explorer.png');

-- No se simula la obtención de logros y compra de recompensas aquí, la lógica está en el backend.