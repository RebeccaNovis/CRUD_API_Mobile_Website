-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: student-databases.cvode4s4cwrc.us-west-2.rds.amazonaws.com
-- Generation Time: Mar 12, 2023 at 04:23 PM
-- Server version: 8.0.28
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `REBECCANOVIS`
--

-- --------------------------------------------------------

--
-- Table structure for table `bsu_info`
--

CREATE TABLE `bsu_info` (
  `id` int NOT NULL,
  `is_bsu` tinyint NOT NULL,
  `proof_bsu` varchar(225) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `bsu_info`
--

INSERT INTO `bsu_info` (`id`, `is_bsu`, `proof_bsu`) VALUES
(1, 1, 'me_garden_cropped.jpg'),
(2, 0, NULL),
(3, 0, NULL),
(4, 1, 'senior_photo.JPG');

-- --------------------------------------------------------

--
-- Table structure for table `reservation_info`
--

CREATE TABLE `reservation_info` (
  `id` int NOT NULL,
  `bsu_id` int NOT NULL,
  `first_name` varchar(225) NOT NULL,
  `last_name` varchar(225) NOT NULL,
  `number_lanes` varchar(225) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `extra_info` varchar(225) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `is_paid` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `reservation_info`
--

INSERT INTO `reservation_info` (`id`, `bsu_id`, `first_name`, `last_name`, `number_lanes`, `date`, `start_time`, `end_time`, `extra_info`, `is_paid`) VALUES
(1, 1, 'Rebecca', 'Novis', '2', '2023-03-17', '13:00:00', '14:00:00', 'n/a', 0),
(2, 1, 'Rebecca', 'Novis', 'Whole Games Center', '2023-03-31', '18:00:00', '19:00:00', 'party', 0),
(3, 2, 'John', 'Smith', '1', '2023-03-20', '12:00:00', '14:00:00', 'none', 0),
(4, 3, 'Mary', 'Sue', '5', '2023-03-24', '12:15:00', '13:15:00', 'campus event', 1),
(5, 4, 'Mark', 'Mump', '3', '2023-04-01', '10:30:00', '11:30:00', 'na', 0),
(6, 2, 'John', 'Smith', '6', '2023-03-26', '14:00:00', '16:00:00', 'na', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bsu_info`
--
ALTER TABLE `bsu_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reservation_info`
--
ALTER TABLE `reservation_info`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bsu_info`
--
ALTER TABLE `bsu_info`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reservation_info`
--
ALTER TABLE `reservation_info`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
