SET NAMES 'utf8';
DROP DATABASE IF EXISTS myCart;
CREATE DATABASE myCart CHARSET=UTF8;
USE myCart;

CREATE TABLE m_products(
    id INT PRIMARY KEY AUTO_INCREMENT,
    pid VARCHAR(16),
    pic VARCHAR(64),
    pname VARCHAR(64),
    price FLOAT(6,2),
    people VARCHAR(16)
);
INSERT INTO m_products(id,pid,pic,pname,price,people) VALUES
(   null,
    '001',
    'img/rec/items-1.jpg',
    '5X 全网通版 4GB内存',
    1799,
    '714'
),
(   null,
    '002',
    'img/rec/items-2.jpg',
    '笔记本电脑Pro 15 i7 16G',
    6999,
    '217'
),
(   null,
    '003',
    'img/rec/items-3.jpg',
    '4A 移动4G+版 2GB内存 16GB',
    599,
    '273'
),
(   null,
    '004',
    'img/rec/items-4.jpg',
    'Max 2 全网通版 4GB内存',
    1599,
    '3万'
),
(   null,
    '005',
    'img/rec/items-5.jpg',
    '手表青春版',
    399,
    '1724'
    
),
(   null,
    '006',
    'img/rec/items-6.jpg',
    '运动鞋 男款',
    199,
    '528'
    
),
(   null,
    '007',
    'img/rec/items-7.jpg',
    '手环 2',
    299,
    '2606'
    
),
(   null,
    '008',
    'img/rec/items-8.jpg',
    'Note 4X 全网通版 3GB内存',
    999,
    '1035'
    
),
(   null,
    '009',
    'img/rec/items-9.jpg',
    '5X 移动4G+版',
    1499,
    '361'
    
),
(   null,
    '010',
    'img/rec/items-10.jpg',
   'Mix2 全网通版 8GB内存 全陶瓷尊享版',
    4699,
    '958'
);

##SELECT * FROM m_products;

CREATE TABLE m_user(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(16),
    pwd VARCHAR(16)
);
CREATE TABLE m_user_order(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(16),
    pnum INT,
    pid VARCHAR(16),
    state INT
);

INSERT INTO m_user(id,user_name,pwd) VALUES
(NULL,'123','123456'),
(NULL,'123','123456');
INSERT INTO m_user_order(id,user_name,pnum,pid,state) VALUES
(NULL,'123',2,'003',1);

##SELECT * FROM m_user;