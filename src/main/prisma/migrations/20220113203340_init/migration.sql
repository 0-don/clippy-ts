-- CreateTable
CREATE TABLE "Clipboard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "size" TEXT,
    "blob" BLOB,
    "star" BOOLEAN NOT NULL DEFAULT false,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startup" BOOLEAN NOT NULL,
    "notification" BOOLEAN NOT NULL,
    "synchronize" BOOLEAN NOT NULL,
    "syncTime" INTEGER NOT NULL,
    "darkmode" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Hotkey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "event" TEXT NOT NULL,
    "ctrl" BOOLEAN NOT NULL,
    "alt" BOOLEAN NOT NULL,
    "shift" BOOLEAN NOT NULL,
    "key" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);
