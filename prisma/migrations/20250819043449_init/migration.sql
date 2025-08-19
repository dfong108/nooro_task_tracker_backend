-- CreateTable
CREATE TABLE `Task` (
    `id` CHAR(25) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `color` ENUM('RED', 'BLUE', 'GREEN') NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Task_completed_idx`(`completed`),
    INDEX `Task_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
