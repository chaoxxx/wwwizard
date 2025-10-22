/*==============================================================*/
/* Table: www_book                                              */
/*==============================================================*/
create table if not exists www_book
(
   id                   varchar(20) not null ,
   book_title           text not null ,
   cover                text ,
   book_type            varchar(2) not null ,
   book_desc            text ,
   book_words_count     bigint not null ,
   create_time          datetime not null ,
   update_time          datetime not null ,
   primary key (id)
);



/*==============================================================*/
/* Table: www_volume                                            */
/*==============================================================*/
create table if not exists www_volume
(
   id                   varchar(20) not null ,
   book_id              varchar(20) not null ,
   volume_title         text not null ,
   volume_desc          text ,
   create_time          datetime not null ,
   primary key (id)
);


/*==============================================================*/
/* Table: www_chapter                                           */
/*==============================================================*/
create table if not exists www_chapter
(
   id                   varchar(20) not null ,
   book_id              varchar(20) not null ,
   volume_id            varchar(20) ,
   chapter_content      text ,
   chapter_words_count  bigint not null ,
   create_time          datetime not null ,
   update_time          datetime not null
);

