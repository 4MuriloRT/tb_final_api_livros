
CREATE DATABASE crud_livros;

USE crud_livros;

CREATE TABLE books(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	title VARCHAR(45) NOT NULL,
	des VARCHAR(255) NOT NULL,
	cover VARCHAR(45) NOT NULL
);

SELECT * from books;

INSERT INTO books(`title`, `des`, `cover`) VALUES
('A volta dos que não foram', 'Este livro conta a histórias ...','avolta.jpg');

SELECT * FROM books;


ALTER TABLE books
ADD price DECIMAL(7,2) NOT NULL;

ALTER TABLE books
MODIFY COLUMN cover VARCHAR(500);


UPDATE books
SET price = 299.00
WHERE id = 10;