-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-02-2026 a las 15:05:37
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `el_buen_sabor_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallepedidos`
--

CREATE TABLE `detallepedidos` (
  `id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `subtotal` float NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `PedidoId` int(11) DEFAULT NULL,
  `PlatoId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detallepedidos`
--

INSERT INTO `detallepedidos` (`id`, `cantidad`, `subtotal`, `createdAt`, `updatedAt`, `PedidoId`, `PlatoId`) VALUES
(22, 1, 2500, '2025-12-26 16:11:09', '2025-12-26 16:11:09', 22, 12),
(23, 1, 3500, '2025-12-26 16:11:09', '2025-12-26 16:11:09', 22, 14),
(24, 1, 6500, '2025-12-26 16:11:09', '2025-12-26 16:11:09', 22, 7),
(25, 1, 5800, '2025-12-26 16:11:09', '2025-12-26 16:11:09', 22, 8),
(26, 1, 9000, '2025-12-26 16:18:29', '2025-12-26 16:18:29', 23, 1),
(27, 1, 9000, '2025-12-26 16:19:46', '2025-12-26 16:19:46', 24, 1),
(28, 1, 9000, '2025-12-26 16:52:31', '2025-12-26 16:52:31', 25, 1),
(29, 1, 9000, '2025-12-26 16:53:09', '2025-12-26 16:53:09', 26, 1),
(30, 1, 2500, '2025-12-26 17:09:48', '2025-12-26 17:09:48', 27, 12),
(31, 1, 7200, '2025-12-26 17:09:48', '2025-12-26 17:09:48', 27, 9),
(32, 1, 5800, '2025-12-26 17:13:55', '2025-12-26 17:13:55', 28, 8),
(33, 1, 9000, '2025-12-26 17:30:26', '2025-12-26 17:30:26', 29, 1),
(34, 1, 2500, '2025-12-26 17:43:19', '2025-12-26 17:43:19', 30, 12),
(35, 1, 7200, '2025-12-26 17:49:42', '2025-12-26 17:49:42', 31, 9),
(36, 1, 8500, '2025-12-26 17:58:22', '2025-12-26 17:58:22', 32, 11),
(37, 1, 6800, '2025-12-26 18:04:17', '2025-12-26 18:04:17', 33, 10),
(38, 2, 18000, '2025-12-28 14:46:29', '2025-12-28 14:46:29', 34, 1),
(39, 3, 7500, '2025-12-28 20:47:15', '2025-12-28 20:47:15', 35, 12),
(40, 1, 1200, '2025-12-28 20:52:31', '2025-12-28 20:52:31', 36, 13),
(41, 1, 12000, '2025-12-30 14:02:33', '2025-12-30 14:02:33', 37, 3),
(42, 1, 3500, '2025-12-30 14:04:28', '2025-12-30 14:04:28', 38, 14),
(43, 1, 1200, '2025-12-30 14:08:42', '2025-12-30 14:08:42', 39, 13),
(44, 3, 20400, '2025-12-30 14:08:42', '2025-12-30 14:08:42', 39, 10),
(45, 1, 3500, '2025-12-30 14:08:42', '2025-12-30 14:08:42', 39, 14),
(46, 1, 2500, '2026-01-06 00:23:57', '2026-01-06 00:23:57', 40, 12),
(47, 5, 12500, '2026-01-07 22:39:52', '2026-01-07 22:39:52', 41, 12),
(174, 3, 7500, '2026-01-19 17:33:19', '2026-01-19 17:33:19', 77, 12),
(175, 1, 1200, '2026-01-19 17:33:19', '2026-01-19 17:33:19', 77, 13),
(176, 1, 2500, '2026-01-19 18:30:35', '2026-01-19 18:30:35', 80, 12),
(179, 2, 14400, '2026-01-20 14:21:44', '2026-01-20 14:21:44', 81, 9),
(184, 1, 3500, '2026-01-20 15:11:52', '2026-01-20 15:11:52', 84, 14),
(185, 5, 6000, '2026-01-20 15:12:51', '2026-01-20 15:12:51', 83, 13),
(186, 1, 3500, '2026-01-20 15:12:51', '2026-01-20 15:12:51', 83, 14),
(187, 1, 2500, '2026-01-20 15:13:36', '2026-01-20 15:13:36', 85, 12),
(193, 1, 2500, '2026-01-20 16:52:20', '2026-01-20 16:52:20', 87, 12),
(196, 3, 7500, '2026-01-20 17:32:54', '2026-01-20 17:32:54', 88, 12),
(200, 1, 2500, '2026-01-20 17:39:01', '2026-01-20 17:39:01', 90, 12),
(211, 2, 5000, '2026-01-21 17:38:02', '2026-01-21 17:38:02', 95, 12),
(215, 2, 14400, '2026-01-21 17:46:03', '2026-01-21 17:46:03', 97, 9),
(218, 1, 2500, '2026-01-21 17:57:56', '2026-01-21 17:57:56', 100, 12),
(223, 1, 2500, '2026-01-21 18:12:05', '2026-01-21 18:12:05', 102, 12),
(224, 5, 32500, '2026-01-21 18:12:05', '2026-01-21 18:12:05', 102, 7),
(226, 2, 18000, '2026-02-06 17:46:30', '2026-02-06 17:46:30', NULL, 1),
(227, 1, 9000, '2026-02-07 14:38:00', '2026-02-07 14:38:00', 104, 1),
(229, 2, 10000, '2026-02-07 14:46:39', '2026-02-07 14:46:39', NULL, 1),
(231, 2, 10000, '2026-02-07 15:05:29', '2026-02-07 15:05:29', NULL, 1),
(233, 2, 10000, '2026-02-07 15:08:44', '2026-02-07 15:08:44', NULL, 1),
(235, 2, 10000, '2026-02-07 15:18:03', '2026-02-07 15:18:03', NULL, 1),
(236, 1, 9000, '2026-02-09 17:14:38', '2026-02-09 17:14:38', 109, 1),
(237, 1, 9000, '2026-02-09 17:43:57', '2026-02-09 17:43:57', 110, 1),
(238, 1, 9000, '2026-02-09 18:06:30', '2026-02-09 18:06:30', 111, 1),
(239, 1, 9000, '2026-02-09 18:24:25', '2026-02-09 18:24:25', 112, 1),
(240, 1, 5000, '2026-02-09 19:01:57', '2026-02-09 19:01:57', 113, 1),
(244, 2, 18000, '2026-02-09 22:03:08', '2026-02-09 22:03:08', 115, 1),
(247, 1, 9000, '2026-02-12 17:35:07', '2026-02-12 17:35:07', 117, 1),
(248, 1, 9000, '2026-02-13 12:23:02', '2026-02-13 12:23:02', 118, 1),
(261, 1, 2500, '2026-02-19 01:11:41', '2026-02-19 01:11:41', 125, 12),
(262, 1, 2500, '2026-02-19 01:12:28', '2026-02-19 01:12:28', 126, 12),
(263, 1, 2500, '2026-02-19 01:12:53', '2026-02-19 01:12:53', 127, 12),
(265, 1, 2800, '2026-02-19 02:26:03', '2026-02-19 02:26:03', 129, 15),
(276, 1, 9000, '2026-02-23 18:21:47', '2026-02-23 18:21:47', 135, 1),
(279, 1, 9000, '2026-02-24 01:17:17', '2026-02-24 01:17:17', 137, 1),
(280, 1, 9000, '2026-02-24 13:53:45', '2026-02-24 13:53:45', 138, 1),
(282, 2, 10000, '2026-02-24 14:11:43', '2026-02-24 14:11:43', 139, 1),
(289, 1, 9000, '2026-02-24 14:49:13', '2026-02-24 14:49:13', 143, 1),
(292, 1, 5000, '2026-02-24 14:50:47', '2026-02-24 14:50:47', 145, 1),
(295, 1, 5000, '2026-02-24 15:11:10', '2026-02-24 15:11:10', 147, 1),
(298, 1, 5000, '2026-02-24 15:19:19', '2026-02-24 15:19:19', 149, 1),
(301, 1, 5000, '2026-02-24 15:24:20', '2026-02-24 15:24:20', 151, 1),
(304, 1, 5000, '2026-02-24 15:36:28', '2026-02-24 15:36:28', 153, 1),
(307, 1, 5000, '2026-02-26 13:39:02', '2026-02-26 13:39:02', 155, 1),
(310, 1, 5000, '2026-02-26 18:23:58', '2026-02-26 18:23:58', 157, 1),
(313, 1, 5000, '2026-02-27 16:39:57', '2026-02-27 16:39:57', 159, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mesas`
--

CREATE TABLE `mesas` (
  `id` int(11) NOT NULL,
  `numero` varchar(10) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `estado` varchar(20) DEFAULT 'libre',
  `total_actual` decimal(10,2) DEFAULT 0.00,
  `mozo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mesas`
--

INSERT INTO `mesas` (`id`, `numero`, `nombre`, `estado`, `total_actual`, `mozo_id`) VALUES
(1, '1', 'Mesa 1', 'libre', 0.00, NULL),
(2, '2', 'Mesa 2', 'libre', 0.00, NULL),
(3, '3', 'Mesa 3', 'libre', 0.00, NULL),
(4, '4', 'Mesa 4', 'libre', 0.00, NULL),
(5, '5', 'Mesa 5', 'libre', 0.00, NULL),
(6, '6', 'Mesa 6', 'libre', 0.00, NULL),
(7, '7', 'Mesa 7', 'libre', 0.00, NULL),
(8, '8', 'Mesa 8', 'libre', 0.00, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `cliente` varchar(255) DEFAULT NULL,
  `mesa` varchar(255) DEFAULT NULL,
  `total` float DEFAULT 0,
  `estado` enum('pendiente','en_preparacion','rechazado','entregado','pagado','cancelado') DEFAULT 'pendiente',
  `PlatoId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fecha` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `cliente`, `mesa`, `total`, `estado`, `PlatoId`, `createdAt`, `updatedAt`, `fecha`) VALUES
(22, 'Cliente App', '1', 18300, 'pagado', NULL, '2025-12-26 16:11:09', '2025-12-26 16:11:48', NULL),
(23, 'Anónimo', '99', 9000, 'pendiente', NULL, '2025-12-26 16:18:29', '2025-12-26 16:18:29', NULL),
(24, 'Anónimo', '99', 9000, 'pendiente', NULL, '2025-12-26 16:19:46', '2025-12-26 16:19:46', NULL),
(25, 'Anónimo', '4', 9000, 'pagado', NULL, '2025-12-26 16:52:31', '2025-12-26 16:53:09', NULL),
(26, 'Anónimo', '4', 9000, 'pagado', NULL, '2025-12-26 16:53:09', '2025-12-26 16:53:09', NULL),
(27, 'Cliente App', '1', 9700, 'pagado', NULL, '2025-12-26 17:09:48', '2025-12-26 17:11:28', NULL),
(28, 'Cliente App', '2', 5800, 'pagado', NULL, '2025-12-26 17:13:55', '2025-12-26 17:14:19', NULL),
(29, 'Anónimo', '4', 9000, 'pagado', NULL, '2025-12-26 17:30:26', '2025-12-26 17:30:26', NULL),
(30, 'Cliente App', '1', 2500, 'pagado', NULL, '2025-12-26 17:43:19', '2025-12-26 18:03:55', NULL),
(31, 'Cliente App', '1', 7200, 'pagado', NULL, '2025-12-26 17:49:42', '2025-12-26 18:03:55', NULL),
(32, 'Cliente App', '1', 8500, 'pagado', NULL, '2025-12-26 17:58:22', '2025-12-26 18:03:55', NULL),
(33, 'Cliente App', '3', 6800, 'pagado', NULL, '2025-12-26 18:04:17', '2025-12-30 14:09:03', NULL),
(34, 'Juan Pérez', '4', 18000, 'pagado', NULL, '2025-12-28 14:46:29', '2026-01-06 00:23:34', NULL),
(35, 'Cliente App', '1', 7500, 'pagado', NULL, '2025-12-28 20:47:15', '2025-12-30 14:04:52', NULL),
(36, 'Cliente App', '1', 1200, 'pagado', NULL, '2025-12-28 20:52:31', '2025-12-30 14:04:52', NULL),
(37, 'Cliente App', '1', 12000, 'pagado', NULL, '2025-12-30 14:02:33', '2025-12-30 14:04:52', NULL),
(38, 'Cliente App', '1', 3500, 'pagado', NULL, '2025-12-30 14:04:28', '2025-12-30 14:04:52', NULL),
(39, 'Cliente App', '3', 25100, 'pagado', NULL, '2025-12-30 14:08:42', '2025-12-30 14:09:03', NULL),
(40, 'Cliente App', '1', 2500, 'pagado', NULL, '2026-01-06 00:23:57', '2026-01-07 22:40:31', NULL),
(41, 'Cliente App', '2', 12500, 'pagado', NULL, '2026-01-07 22:39:52', '2026-01-07 22:40:22', NULL),
(77, 'Cliente App', '1', 8700, 'pagado', NULL, '2026-01-19 17:23:23', '2026-01-19 18:21:39', NULL),
(80, 'Cliente App', '1', 2500, 'pagado', NULL, '2026-01-19 18:30:35', '2026-01-19 18:30:55', NULL),
(81, 'Cliente App', '1', 14400, 'pagado', NULL, '2026-01-20 13:51:17', '2026-01-20 14:22:13', NULL),
(83, 'Cliente App', '2', 9500, 'pagado', NULL, '2026-01-20 14:42:58', '2026-01-20 15:13:22', NULL),
(84, 'Cliente App', '2', 3500, 'pagado', NULL, '2026-01-20 15:11:51', '2026-01-20 15:13:22', NULL),
(85, 'Cliente App', '1', 2500, 'pagado', NULL, '2026-01-20 15:13:36', '2026-01-20 15:13:42', NULL),
(87, 'Cliente App', '1', 2500, 'pagado', NULL, '2026-01-20 16:52:20', '2026-01-20 16:52:26', NULL),
(88, 'Cliente App', '1', 7500, 'pagado', NULL, '2026-01-20 16:52:41', '2026-01-20 17:33:22', NULL),
(90, 'Cliente App', '1', 2500, 'pagado', NULL, '2026-01-20 17:39:01', '2026-01-20 17:39:08', NULL),
(95, 'Cliente App', '1', 5000, 'pagado', NULL, '2026-01-21 16:26:14', '2026-01-21 17:38:13', NULL),
(97, 'Cliente App', '2', 14400, 'pagado', NULL, '2026-01-21 17:45:13', '2026-02-19 02:23:35', NULL),
(100, 'Cliente App', '1', 2500, 'pagado', NULL, '2026-01-21 17:57:56', '2026-01-21 18:12:25', NULL),
(102, 'Cliente App', '1', 35000, 'pagado', NULL, '2026-01-21 18:11:34', '2026-01-21 18:12:25', NULL),
(104, 'Prueba CI/CD', '4', 9000, 'pagado', NULL, '2026-02-07 14:38:00', '2026-02-07 14:38:21', NULL),
(109, 'Prueba CI/CD', '4', 9000, 'pagado', NULL, '2026-02-09 17:14:38', '2026-02-17 12:53:01', NULL),
(110, 'Prueba CI/CD', '4', 9000, 'pagado', NULL, '2026-02-09 17:43:57', '2026-02-17 12:53:01', NULL),
(111, 'Prueba CI/CD', '4', 9000, 'pagado', NULL, '2026-02-09 18:06:30', '2026-02-17 12:53:01', NULL),
(112, 'Prueba CI/CD', '4', 9000, 'pagado', NULL, '2026-02-09 18:24:25', '2026-02-17 12:53:01', NULL),
(113, 'Prueba CI/CD', '4', 5000, 'pagado', NULL, '2026-02-09 19:01:57', '2026-02-17 12:53:01', NULL),
(115, 'Prueba CI/CD', '4', 18000, 'pagado', NULL, '2026-02-09 22:02:56', '2026-02-17 12:53:01', NULL),
(117, 'Prueba CI/CD', '4', 9000, 'pagado', NULL, '2026-02-12 17:35:07', '2026-02-17 12:53:01', NULL),
(118, 'Prueba CI/CD', '4', 9000, 'pagado', NULL, '2026-02-13 12:23:02', '2026-02-17 12:53:01', NULL),
(125, 'Cliente App', '2', 2500, 'pagado', NULL, '2026-02-19 01:11:41', '2026-02-19 02:23:35', NULL),
(126, 'Cliente App', '2', 2500, 'pagado', NULL, '2026-02-19 01:12:28', '2026-02-19 02:23:35', NULL),
(127, 'Cliente App', '1', 2500, 'pagado', NULL, '2026-02-19 01:12:53', '2026-02-19 02:23:26', NULL),
(129, 'Cliente App', '2', 2800, 'pagado', NULL, '2026-02-19 02:26:03', '2026-02-19 02:27:10', NULL),
(135, 'Prueba CI/CD', '4', 9000, 'pagado', NULL, '2026-02-23 18:21:47', '2026-02-23 18:27:13', NULL),
(137, 'Prueba CI/CD', '4', 9000, 'pagado', NULL, '2026-02-24 01:17:16', '2026-02-24 01:19:07', NULL),
(138, 'Prueba CI/CD', '4', 9000, 'pagado', NULL, '2026-02-24 13:53:45', '2026-02-24 13:54:15', NULL),
(139, 'Prueba CI/CD', '4', 10000, 'pagado', NULL, '2026-02-24 14:11:43', '2026-02-24 14:11:43', NULL),
(143, 'Prueba CI/CD', '4', 9000, 'pagado', NULL, '2026-02-24 14:49:13', '2026-02-24 14:49:18', NULL),
(145, 'Prueba CI/CD', '4', 5000, 'pagado', NULL, '2026-02-24 14:50:47', '2026-02-24 14:50:47', NULL),
(147, 'Prueba CI/CD', '4', 5000, 'pagado', NULL, '2026-02-24 15:11:10', '2026-02-24 15:11:10', NULL),
(149, 'Prueba CI/CD', '4', 5000, 'pagado', NULL, '2026-02-24 15:19:19', '2026-02-24 15:19:19', NULL),
(151, 'Prueba CI/CD', '4', 5000, 'pagado', NULL, '2026-02-24 15:24:20', '2026-02-24 15:24:20', NULL),
(153, 'Prueba CI/CD', '4', 5000, 'pagado', NULL, '2026-02-24 15:36:28', '2026-02-24 15:36:28', NULL),
(155, 'Prueba CI/CD', '4', 5000, 'pagado', NULL, '2026-02-26 13:39:02', '2026-02-26 13:39:03', NULL),
(157, 'Prueba CI/CD', '4', 5000, 'pagado', NULL, '2026-02-26 18:23:58', '2026-02-26 18:23:58', NULL),
(159, 'Prueba CI/CD', '4', 5000, 'pagado', NULL, '2026-02-27 16:39:57', '2026-02-27 16:39:57', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platos`
--

CREATE TABLE `platos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stockActual` int(11) NOT NULL DEFAULT 0,
  `descripcion` varchar(255) DEFAULT NULL,
  `esMenuDelDia` tinyint(1) DEFAULT 0,
  `imagenPath` varchar(255) DEFAULT NULL,
  `rubroId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `esIlimitado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `platos`
--

INSERT INTO `platos` (`id`, `nombre`, `precio`, `stockActual`, `descripcion`, `esMenuDelDia`, `imagenPath`, `rubroId`, `createdAt`, `updatedAt`, `esIlimitado`) VALUES
(1, 'hamburguesa test', 9000.00, 99, 'Hamburguesa de prueba con mucho cheddar', 0, '/uploads/imagen-1766679031212-410551175.jpg', 1, '2025-12-25 15:16:37', '2026-02-27 16:39:57', 0),
(2, 'Parrillada', 8500.00, 100, 'Parrillada completa para 2 personas', 1, '/uploads/imagen-1767103035675-146447743.jpg', 1, '2025-12-26 12:17:39', '2025-12-30 13:57:15', 0),
(3, 'Milanesa a Caballo', 12000.00, 30, 'milanesas de carne con papas fritas y huevo frito', 0, '/uploads/imagen-1767102947799-757149724.jpg', 7, '2025-12-26 12:18:17', '2025-12-30 13:55:47', 0),
(4, 'Sorrentinos de Jamón y Queso', 7500.00, 0, 'Con salsa fileto y parmesano.', 1, '/uploads/imagen-1767102837114-566474474.jpg', 2, '2025-12-26 12:46:32', '2025-12-30 13:53:57', 0),
(5, 'Tallarines Caseros', 6800.00, 0, 'Cinta ancha al huevo con salsa bolognesa.', 0, '/uploads/imagen-1767102870766-878554398.jpg', 2, '2025-12-26 12:46:32', '2025-12-30 13:54:30', 0),
(6, 'Ñoquis de Papa', 6500.00, 0, 'Clásicos del 29, con estofado.', 0, '/uploads/imagen-1767102896096-604413857.jpg', 2, '2025-12-26 12:46:32', '2025-12-30 13:54:56', 0),
(7, 'Hamburguesa Doble Cheddar', 6500.00, 45, 'Doble carne, doble cheddar y bacon crocante.', 1, '/uploads/imagen-1767103014325-638172154.jpg', 4, '2025-12-26 13:06:01', '2026-01-21 18:12:05', 0),
(8, 'Hamburguesa Veggie', 5800.00, 20, 'Medallón de lentejas, rúcula y tomate.', 0, '/uploads/imagen-1767102918741-376484049.jpeg', 4, '2025-12-26 13:06:01', '2025-12-30 13:55:18', 0),
(9, 'Ravioles de Ricota', 7200.00, 26, 'Con salsa mixta y mucho queso rallado.', 0, '/uploads/imagen-1767102969281-600492146.jpg', 2, '2025-12-26 13:06:01', '2026-01-21 17:46:03', 0),
(10, 'Fideos con Estofado', 6800.00, 40, 'Tallarines al huevo con carne tiernizada.', 1, '/uploads/imagen-1767102986890-201430490.jpg', 2, '2025-12-26 13:06:01', '2025-12-30 13:56:26', 0),
(11, 'Pizza Calabresa', 8500.00, 100, 'Muzzarella y rodajas de longaniza.', 0, '/uploads/imagen-1767103057123-207076037.jpg', 5, '2025-12-26 13:06:01', '2025-12-30 13:57:37', 0),
(12, 'Coca-Cola 1.5L', 2500.00, 83, 'Para compartir.', 0, '/uploads/imagen-1767103083549-444430993.jpg', 9, '2025-12-26 13:06:01', '2026-02-19 01:12:53', 0),
(13, 'Agua Mineral 500ml', 1200.00, 94, 'Eco de los Andes, sin gas.', 0, '/uploads/imagen-1767103094928-624366266.jpg', 9, '2025-12-26 13:06:01', '2026-01-21 17:57:36', 0),
(14, 'Cerveza Patagonia Amber', 3500.00, 58, 'Lata 473ml. Sabor intenso.', 1, '/uploads/imagen-1767103407797-668853691.jpg', 10, '2025-12-26 13:06:01', '2026-02-19 02:26:59', 0),
(15, 'Quilmes Clásica 1L', 2800.00, 119, 'Botella retornable (se cobra envase si no tiene).', 0, '/uploads/imagen-1767103346713-377480906.jpg', 10, '2025-12-26 13:06:01', '2026-02-19 02:26:03', 0),
(52, 'Milanesa Napolitana', 8500.00, 20, NULL, 1, NULL, 1, '2026-02-12 13:15:23', '2026-02-12 13:15:23', 0),
(53, 'Coca Cola 1.5L', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-12 13:17:04', '2026-02-12 13:17:04', 1),
(56, 'coca cola test 1771340116', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-17 14:55:16', '2026-02-17 14:55:16', 1),
(57, 'hamburguesa vegana test 1771340504', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-17 15:01:44', '2026-02-17 15:01:44', 0),
(58, 'hamburguesa vegana test 1771341530', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-17 15:18:50', '2026-02-17 15:18:50', 0),
(59, 'hamburguesa vegana test 1771341945', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, '/uploads/imagen-1771342043149-415339934.jpg', 1, '2026-02-17 15:25:44', '2026-02-17 15:27:23', 0),
(60, 'hamburguesa vegana test 1771342137', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-17 15:28:57', '2026-02-17 15:28:57', 0),
(61, 'coca cola test 1771342137', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-17 15:28:57', '2026-02-17 15:28:57', 1),
(62, 'hamburguesa vegana test 1771342546', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-17 15:35:46', '2026-02-17 15:35:46', 0),
(63, 'coca cola test 1771342547', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-17 15:35:46', '2026-02-17 15:35:46', 1),
(64, 'hamburguesa vegana test 1771868234', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-23 17:37:13', '2026-02-23 17:37:13', 0),
(65, 'coca cola test 1771868234', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-23 17:37:13', '2026-02-23 17:37:13', 1),
(66, 'hamburguesa vegana test 1771869160', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-23 17:52:39', '2026-02-23 17:52:39', 0),
(67, 'coca cola test 1771869160', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-23 17:52:39', '2026-02-23 17:52:39', 1),
(68, 'hamburguesa vegana test 1771869336', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-23 17:55:36', '2026-02-23 17:55:36', 0),
(69, 'coca cola test 1771869336', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-23 17:55:36', '2026-02-23 17:55:36', 1),
(70, 'hamburguesa vegana test 1771870628', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-23 18:17:08', '2026-02-23 18:17:08', 0),
(71, 'coca cola test 1771870628', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-23 18:17:08', '2026-02-23 18:17:08', 1),
(72, 'hamburguesa vegana test 1771870740', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-23 18:19:00', '2026-02-23 18:19:00', 0),
(73, 'coca cola test 1771870741', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-23 18:19:00', '2026-02-23 18:19:00', 1),
(74, 'hamburguesa vegana test 1771871233', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-23 18:27:12', '2026-02-23 18:27:12', 0),
(75, 'coca cola test 1771871233', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-23 18:27:13', '2026-02-23 18:27:13', 1),
(76, 'hamburguesa vegana test 1771942304', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-24 14:11:44', '2026-02-24 14:11:44', 0),
(77, 'coca cola test 1771942304', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-24 14:11:44', '2026-02-24 14:11:44', 1),
(78, 'hamburguesa vegana test 1771943023', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, '/uploads/imagen-1772129919180-447222932.jpg', 1, '2026-02-24 14:23:43', '2026-02-26 18:18:39', 0),
(79, 'hamburguesa vegana test 1771943222', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-24 14:27:02', '2026-02-24 14:27:02', 0),
(80, 'coca cola test 1771943223', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-24 14:27:02', '2026-02-24 14:27:02', 1),
(81, 'hamburguesa vegana test 1771944648', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-24 14:50:47', '2026-02-24 14:50:47', 0),
(82, 'coca cola test 1771944648', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-24 14:50:47', '2026-02-24 14:50:47', 1),
(83, 'hamburguesa vegana test 1771945871', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-24 15:11:11', '2026-02-24 15:11:11', 0),
(84, 'coca cola test 1771945871', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-24 15:11:11', '2026-02-24 15:11:11', 1),
(85, 'hamburguesa vegana test 1771946360', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-24 15:19:19', '2026-02-24 15:19:19', 0),
(86, 'coca cola test 1771946360', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-24 15:19:19', '2026-02-24 15:19:19', 1),
(87, 'hamburguesa vegana test 1771946661', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-24 15:24:20', '2026-02-24 15:24:20', 0),
(88, 'coca cola test 1771946661', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-24 15:24:20', '2026-02-24 15:24:20', 1),
(89, 'hamburguesa vegana test 1771947389', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-24 15:36:28', '2026-02-24 15:36:28', 0),
(90, 'coca cola test 1771947389', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-24 15:36:28', '2026-02-24 15:36:28', 1),
(91, 'hamburguesa vegana test 1772113143', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-26 13:39:03', '2026-02-26 13:39:03', 0),
(92, 'coca cola test 1772113143', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-26 13:39:03', '2026-02-26 13:39:03', 1),
(93, 'hamburguesa vegana test 1772130239', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, NULL, 1, '2026-02-26 18:23:58', '2026-02-26 18:23:58', 0),
(94, 'coca cola test 1772130239', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-26 18:23:58', '2026-02-26 18:23:58', 1),
(95, 'hamburguesa vegana test 1772210398', 7200.00, 15, 'Medallón de lentejas, rúcula y tomate.', 0, '/uploads/imagen-1772210397909-678062429.jpg', 1, '2026-02-27 16:39:57', '2026-02-27 16:39:57', 0),
(96, 'coca cola test 1772210398', 4500.00, 0, NULL, 0, NULL, 2, '2026-02-27 16:39:57', '2026-02-27 16:39:57', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rubros`
--

CREATE TABLE `rubros` (
  `id` int(11) NOT NULL,
  `denominacion` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `padreId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rubros`
--

INSERT INTO `rubros` (`id`, `denominacion`, `activo`, `padreId`, `createdAt`, `updatedAt`) VALUES
(1, 'Cocina', 1, NULL, '2025-12-25 15:16:37', '2025-12-25 15:16:37'),
(2, 'Pastas', 1, 1, '2025-12-26 12:46:32', '2025-12-26 12:48:08'),
(3, 'Bebidas', 1, NULL, '2025-12-26 12:48:08', '2025-12-26 12:48:08'),
(4, 'Hamburguesas', 1, 1, '2025-12-26 12:48:08', '2025-12-26 12:48:08'),
(5, 'Pizzas', 1, 1, '2025-12-26 12:48:08', '2025-12-26 12:48:08'),
(6, 'Empanadas', 1, 1, '2025-12-26 12:48:08', '2025-12-26 12:48:08'),
(7, 'Minutas', 1, 1, '2025-12-26 12:48:08', '2025-12-26 12:48:08'),
(8, 'Sandwiches', 1, 1, '2025-12-26 12:48:08', '2025-12-26 12:48:08'),
(9, 'Sin Alcohol', 1, 3, '2025-12-26 12:48:08', '2025-12-26 12:48:08'),
(10, 'Cervezas', 1, 3, '2025-12-26 12:48:08', '2025-12-26 12:48:08'),
(11, 'Vinos', 1, 3, '2025-12-26 12:48:08', '2025-12-26 12:48:08'),
(12, 'Tragos', 1, 3, '2025-12-26 12:48:08', '2025-12-26 12:48:08'),
(13, 'Postres Test 1771856918', 1, NULL, '2026-02-23 14:28:37', '2026-02-23 14:28:37'),
(14, 'Tortas Test 1771857081', 1, 13, '2026-02-23 14:31:20', '2026-02-23 14:31:20'),
(15, 'Postres Test 1771868232', 1, NULL, '2026-02-23 17:37:12', '2026-02-23 17:37:12'),
(16, 'Postres Test 1771869159', 1, NULL, '2026-02-23 17:52:38', '2026-02-23 17:52:38'),
(17, 'Tortas Test 1771869159', 1, 16, '2026-02-23 17:52:38', '2026-02-23 17:52:38'),
(18, 'Postres Test 1771869335', 1, NULL, '2026-02-23 17:55:35', '2026-02-23 17:55:35'),
(19, 'Tortas Test 1771869335', 1, 18, '2026-02-23 17:55:35', '2026-02-23 17:55:35'),
(20, 'Tortas Test 1771870542', 1, 13, '2026-02-23 18:15:42', '2026-02-23 18:15:42'),
(21, 'Postres Test 1771870627', 1, NULL, '2026-02-23 18:17:06', '2026-02-23 18:17:06'),
(22, 'Tortas Test 1771870627', 1, 21, '2026-02-23 18:17:07', '2026-02-23 18:17:07'),
(23, 'Postres Test 1771870740', 1, NULL, '2026-02-23 18:18:59', '2026-02-23 18:18:59'),
(24, 'Tortas Test 1771870740', 1, 23, '2026-02-23 18:18:59', '2026-02-23 18:18:59'),
(25, 'Postres Test 1771871232', 1, NULL, '2026-02-23 18:27:11', '2026-02-23 18:27:11'),
(26, 'Tortas Test 1771871232', 1, 25, '2026-02-23 18:27:11', '2026-02-23 18:27:11'),
(27, 'Postres Test 1771942303', 1, NULL, '2026-02-24 14:11:42', '2026-02-24 14:11:42'),
(28, 'Tortas Test 1771942303', 1, NULL, '2026-02-24 14:11:43', '2026-02-24 14:11:43'),
(29, 'Postres Test 1771942419', 1, NULL, '2026-02-24 14:13:39', '2026-02-24 14:13:39'),
(30, 'Postres Test 1771942668', 1, NULL, '2026-02-24 14:17:48', '2026-02-24 14:17:48'),
(31, 'Postres Test 1771942766', 1, NULL, '2026-02-24 14:19:26', '2026-02-24 14:19:26'),
(32, 'Tortas Test 1771942773', 1, 31, '2026-02-24 14:19:33', '2026-02-24 14:19:33'),
(33, 'Postres Test 1771943221', 1, NULL, '2026-02-24 14:27:01', '2026-02-24 14:27:01'),
(34, 'Tortas Test 1771943221', 1, 33, '2026-02-24 14:27:01', '2026-02-24 14:27:01'),
(35, 'Postres Test 1771944646', 1, NULL, '2026-02-24 14:50:46', '2026-02-24 14:50:46'),
(36, 'Tortas Test 1771944646', 1, 35, '2026-02-24 14:50:46', '2026-02-24 14:50:46'),
(37, 'Postres Test 1771945870', 1, NULL, '2026-02-24 15:11:09', '2026-02-24 15:11:09'),
(38, 'Tortas Test 1771945870', 1, 37, '2026-02-24 15:11:09', '2026-02-24 15:11:09'),
(39, 'Postres Test 1771946358', 1, NULL, '2026-02-24 15:19:18', '2026-02-24 15:19:18'),
(40, 'Tortas Test 1771946358', 1, 39, '2026-02-24 15:19:18', '2026-02-24 15:19:18'),
(41, 'Postres Test 1771946659', 1, NULL, '2026-02-24 15:24:19', '2026-02-24 15:24:19'),
(42, 'Tortas Test 1771946659', 1, 41, '2026-02-24 15:24:19', '2026-02-24 15:24:19'),
(43, 'Postres Test 1771947387', 1, NULL, '2026-02-24 15:36:27', '2026-02-24 15:36:27'),
(44, 'Tortas Test 1771947387', 1, 43, '2026-02-24 15:36:27', '2026-02-24 15:36:27'),
(45, 'Postres Test 1772113142', 1, NULL, '2026-02-26 13:39:01', '2026-02-26 13:39:01'),
(46, 'Tortas Test 1772113142', 1, 45, '2026-02-26 13:39:01', '2026-02-26 13:39:01'),
(47, 'Postres Test 1772130237', 1, NULL, '2026-02-26 18:23:57', '2026-02-26 18:23:57'),
(48, 'Tortas Test 1772130237', 1, 47, '2026-02-26 18:23:57', '2026-02-26 18:23:57'),
(49, 'Postres Test 1772210396', 1, NULL, '2026-02-27 16:39:55', '2026-02-27 16:39:55'),
(50, 'Tortas Test 1772210396', 1, 49, '2026-02-27 16:39:55', '2026-02-27 16:39:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20251123021817-create-plato.js'),
('20251123022254-create-pedido.js'),
('20251128221350-add-imagenUrl-to-platos.js'),
('20251202132432-add-mesa-to-pedidos.js'),
('20251205213837-add-total-column-to-pedidos.js'),
('20251205214943-add-mesa-column-to-pedidos.js'),
('20251206201602-update-enum-estado-pedidos.js'),
('20251206202452-fix-enum-pagado-force.js'),
('20251216155124-create-rubros-table.js'),
('20251216160000-add-details-to-platos.js'),
('20251216162342-add-columns-to-platos.js'),
('20260214120857-remove-stockInicial-from-platos.js'),
('20260226101000-add-activo-to-usuarios.js');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `legajo` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','mozo','cocinero','cajero') DEFAULT 'mozo',
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `legajo`, `password`, `rol`, `activo`) VALUES
(1, 'Dante', 'Admin', '1001', '$2b$10$VuWhxZ7VrdJ/dpipx9kTY.ChzPwzCA0trxXQTfCvtkGWzKSSuoxlO', 'admin', 1),
(2, 'Usuario', 'PruebaEditado', 'UT1772112013', '$2b$10$y8rgFrPvVMCsBdjTCgQrMOwjNnTsv0IwTqZuCgsBTnT.q/QuDdhQa', 'cajero', 0),
(3, 'Usuario', 'PruebaEditado', 'UT1772113144', '$2b$10$CQBFKFoUO2ignPLJZKmK/.3a0W6SuWQ0Y3Y1KEu/G1CPX5uwluTpm', 'cajero', 0),
(4, 'Usuario', 'PruebaEditado', 'UT1772130239', '$2b$10$C0eNwwyPbIkGH57mcvGEH.aJnfXSoLn3eInWXnv4HC/UnTIwBTfOO', 'cajero', 0),
(5, 'Usuario', 'PruebaEditado', 'UT1772210398', '$2b$10$KuocCGynzuZ5noapPI60luAChfVRhHzuFZEkyk5vSuLP9AOQmexha', 'cajero', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detallepedidos`
--
ALTER TABLE `detallepedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PedidoId` (`PedidoId`),
  ADD KEY `PlatoId` (`PlatoId`);

--
-- Indices de la tabla `mesas`
--
ALTER TABLE `mesas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mozo_id` (`mozo_id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PlatoId` (`PlatoId`);

--
-- Indices de la tabla `platos`
--
ALTER TABLE `platos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_nombre_plato` (`nombre`),
  ADD KEY `rubroId` (`rubroId`);

--
-- Indices de la tabla `rubros`
--
ALTER TABLE `rubros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `padreId` (`padreId`);

--
-- Indices de la tabla `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `legajo` (`legajo`),
  ADD UNIQUE KEY `legajo_30` (`legajo`),
  ADD UNIQUE KEY `legajo_31` (`legajo`),
  ADD UNIQUE KEY `legajo_32` (`legajo`),
  ADD UNIQUE KEY `legajo_33` (`legajo`),
  ADD UNIQUE KEY `legajo_34` (`legajo`),
  ADD UNIQUE KEY `legajo_35` (`legajo`),
  ADD UNIQUE KEY `legajo_36` (`legajo`),
  ADD UNIQUE KEY `legajo_37` (`legajo`),
  ADD UNIQUE KEY `legajo_38` (`legajo`),
  ADD UNIQUE KEY `legajo_39` (`legajo`),
  ADD UNIQUE KEY `legajo_40` (`legajo`),
  ADD UNIQUE KEY `legajo_41` (`legajo`),
  ADD UNIQUE KEY `legajo_42` (`legajo`),
  ADD UNIQUE KEY `legajo_43` (`legajo`),
  ADD UNIQUE KEY `legajo_44` (`legajo`),
  ADD UNIQUE KEY `legajo_45` (`legajo`),
  ADD UNIQUE KEY `legajo_46` (`legajo`),
  ADD UNIQUE KEY `legajo_47` (`legajo`),
  ADD UNIQUE KEY `legajo_48` (`legajo`),
  ADD UNIQUE KEY `legajo_49` (`legajo`),
  ADD UNIQUE KEY `legajo_50` (`legajo`),
  ADD UNIQUE KEY `legajo_51` (`legajo`),
  ADD UNIQUE KEY `legajo_52` (`legajo`),
  ADD UNIQUE KEY `legajo_53` (`legajo`),
  ADD UNIQUE KEY `legajo_54` (`legajo`),
  ADD UNIQUE KEY `legajo_55` (`legajo`),
  ADD UNIQUE KEY `legajo_56` (`legajo`),
  ADD UNIQUE KEY `legajo_57` (`legajo`),
  ADD UNIQUE KEY `legajo_58` (`legajo`),
  ADD UNIQUE KEY `legajo_59` (`legajo`),
  ADD UNIQUE KEY `legajo_60` (`legajo`),
  ADD UNIQUE KEY `legajo_61` (`legajo`),
  ADD UNIQUE KEY `legajo_62` (`legajo`),
  ADD UNIQUE KEY `legajo_63` (`legajo`),
  ADD UNIQUE KEY `legajo_2` (`legajo`),
  ADD UNIQUE KEY `legajo_3` (`legajo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detallepedidos`
--
ALTER TABLE `detallepedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=314;

--
-- AUTO_INCREMENT de la tabla `mesas`
--
ALTER TABLE `mesas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- AUTO_INCREMENT de la tabla `platos`
--
ALTER TABLE `platos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT de la tabla `rubros`
--
ALTER TABLE `rubros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detallepedidos`
--
ALTER TABLE `detallepedidos`
  ADD CONSTRAINT `detallepedidos_ibfk_1` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_101` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_103` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_105` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_107` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_109` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_11` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_111` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_113` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_115` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_117` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_119` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_121` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_123` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_125` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_127` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_129` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_13` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_131` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_133` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_135` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_137` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_139` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_141` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_143` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_145` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_147` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_149` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_15` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_151` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_153` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_155` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_157` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_159` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_161` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_163` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_165` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_167` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_169` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_17` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_171` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_173` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_175` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_177` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_179` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_181` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_183` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_185` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_187` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_189` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_19` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_191` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_193` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_195` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_197` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_199` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_201` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_203` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_205` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_207` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_209` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_21` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_211` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_213` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_215` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_217` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_219` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_221` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_223` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_225` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_227` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_229` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_23` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_231` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_233` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_235` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_237` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_239` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_241` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_243` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_245` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_247` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_249` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_25` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_251` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_253` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_255` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_257` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_259` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_261` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_263` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_265` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_266` FOREIGN KEY (`PlatoId`) REFERENCES `platos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_27` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_29` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_3` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_31` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_33` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_35` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_37` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_39` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_41` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_43` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_45` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_47` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_49` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_5` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_51` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_53` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_55` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_57` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_59` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_61` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_63` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_65` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_67` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_69` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_7` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_71` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_73` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_75` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_77` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_79` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_81` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_83` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_85` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_87` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_89` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_9` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_91` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_93` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_95` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_97` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_99` FOREIGN KEY (`PedidoId`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `mesas`
--
ALTER TABLE `mesas`
  ADD CONSTRAINT `mesas_ibfk_1` FOREIGN KEY (`mozo_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`PlatoId`) REFERENCES `platos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `platos`
--
ALTER TABLE `platos`
  ADD CONSTRAINT `platos_ibfk_1` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_10` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_100` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_101` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_102` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_103` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_104` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_105` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_106` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_107` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_108` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_109` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_11` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_110` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_111` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_112` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_113` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_114` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_115` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_116` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_117` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_118` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_119` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_12` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_120` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_121` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_122` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_123` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_124` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_125` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_126` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_127` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_128` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_129` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_13` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_130` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_131` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_132` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_133` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_14` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_15` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_16` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_17` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_18` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_19` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_2` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_20` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_21` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_22` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_23` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_24` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_25` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_26` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_27` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_28` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_29` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_3` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_30` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_31` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_32` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_33` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_34` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_35` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_36` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_37` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_38` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_39` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_4` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_40` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_41` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_42` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_43` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_44` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_45` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_46` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_47` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_48` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_49` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_5` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_50` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_51` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_52` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_53` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_54` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_55` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_56` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_57` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_58` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_59` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_6` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_60` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_61` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_62` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_63` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_64` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_65` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_66` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_67` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_68` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_69` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_7` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_70` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_71` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_72` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_73` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_74` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_75` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_76` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_77` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_78` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_79` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_8` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_80` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_81` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_82` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_83` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_84` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_85` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_86` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_87` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_88` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_89` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_9` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_90` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_91` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_92` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_93` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_94` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_95` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_96` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_97` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_98` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `platos_ibfk_99` FOREIGN KEY (`rubroId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `rubros`
--
ALTER TABLE `rubros`
  ADD CONSTRAINT `rubros_ibfk_1` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_10` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_100` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_101` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_102` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_103` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_104` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_105` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_106` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_107` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_108` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_109` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_11` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_110` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_111` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_112` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_113` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_114` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_115` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_116` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_117` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_118` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_119` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_12` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_120` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_121` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_122` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_123` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_124` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_125` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_126` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_127` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_128` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_129` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_13` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_130` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_131` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_132` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_133` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_14` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_15` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_16` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_17` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_18` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_19` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_2` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_20` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_21` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_22` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_23` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_24` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_25` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_26` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_27` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_28` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_29` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_3` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_30` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_31` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_32` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_33` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_34` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_35` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_36` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_37` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_38` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_39` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_4` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_40` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_41` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_42` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_43` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_44` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_45` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_46` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_47` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_48` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_49` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_5` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_50` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_51` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_52` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_53` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_54` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_55` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_56` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_57` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_58` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_59` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_6` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_60` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_61` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_62` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_63` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_64` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_65` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_66` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_67` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_68` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_69` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_7` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_70` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_71` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_72` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_73` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_74` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_75` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_76` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_77` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_78` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_79` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_8` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_80` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_81` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_82` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_83` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_84` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_85` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_86` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_87` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_88` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_89` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_9` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_90` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_91` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_92` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_93` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_94` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_95` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_96` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_97` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_98` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rubros_ibfk_99` FOREIGN KEY (`padreId`) REFERENCES `rubros` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
