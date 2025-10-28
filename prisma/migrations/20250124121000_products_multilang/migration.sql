-- Add multilingual name columns to products
ALTER TABLE `products`
  ADD COLUMN `name_en` VARCHAR(191) NOT NULL DEFAULT '',
  ADD COLUMN `name_tk` VARCHAR(191) NOT NULL DEFAULT '';

-- Backfill from existing name to new locales
UPDATE `products` SET `name_en` = `name`, `name_tk` = `name` WHERE `name_en` = '' OR `name_tk` = '';

-- Rename original name to name_ru
ALTER TABLE `products` CHANGE COLUMN `name` `name_ru` VARCHAR(191) NOT NULL;
