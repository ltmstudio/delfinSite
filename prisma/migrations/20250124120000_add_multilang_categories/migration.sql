-- AlterTable
ALTER TABLE `categories` ADD COLUMN `name_en` VARCHAR(191) NOT NULL DEFAULT '',
ADD COLUMN `name_tk` VARCHAR(191) NOT NULL DEFAULT '';

-- Update existing records with default values
UPDATE `categories` SET 
  `name_en` = `name`,
  `name_tk` = `name`
WHERE `name_en` = '' OR `name_tk` = '';

-- Rename the original name column to name_ru
ALTER TABLE `categories` CHANGE COLUMN `name` `name_ru` VARCHAR(191) NOT NULL;
