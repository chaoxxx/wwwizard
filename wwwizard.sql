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
   update_time          datetime not null,
   primary key (id)
);

/*==============================================================*/
/* Table: www_character                                         */
/*==============================================================*/
create table if not exists www_character
(
   id                   varchar(20) not null,
   book_id              varchar(20) not null,
   character_first_name varchar(10) ,
   character_mid_name   varchar(10) ,
   character_last_name  varchar(10) ,
   character_full_name  varchar(50) ,
   character_nickname   varchar(50) ,
   character_gender     varchar(2) ,
   character_age        int ,
   character_birthday   varchar(20)  ,
   species              varchar(10)  ,
   occupation           varchar(10)  ,
   main_character_flag  varchar(2)  ,
   character_status     varchar(2)  ,
   character_remark     text  ,
   character_personality text  ,
   create_time          datetime not null,
   update_time          datetime not null,
   primary key (id)
);
