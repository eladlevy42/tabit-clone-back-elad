-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate or delete data from parent table
TRUNCATE TABLE Reservations;  -- or DELETE FROM Restaurants;
TRUNCATE TABLE RestaurantMenus;  -- or DELETE FROM Restaurants;
TRUNCATE TABLE Restaurants;  -- or DELETE FROM Restaurants;
TRUNCATE TABLE OpeningHours;
TRUNCATE TABLE RestaurantsPhotos;  -- or DELETE FROM Restaurants;
TRUNCATE TABLE Tables;  -- or DELETE FROM Restaurants;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
