/*==============================================================*/
/* Table: www_book                                              */
/*==============================================================*/
create table if not exists www_book
(
   id                   varchar(20) not null comment '唯一标识',
   book_title           text not null comment '书籍标题',
   cover                text comment '封面路径',
   book_type            varchar(2) not null comment '书籍类型',
   book_desc            text comment '书籍描述',
   book_words_count     bigint not null comment '字数统计',
   create_time          datetime not null comment '创建时间',
   update_time          datetime not null comment '最后编辑时间',
   primary key (id)
);

alter table if not exists www_book comment '书本信息表';

/*==============================================================*/
/* Table: www_volume                                            */
/*==============================================================*/
create table if not exists www_volume
(
   id                   varchar(20) not null comment '唯一标识',
   book_id              varchar(20) not null comment 'www_book唯一标识',
   volume_title         text not null comment '卷标题',
   volume_desc          text comment '卷描述',
   create_time          datetime not null comment '创建时间',
   primary key (id)
);

alter table if not exists www_volume comment '书籍卷信息';

/*==============================================================*/
/* Table: www_chapter                                           */
/*==============================================================*/
create table if not exists www_chapter
(
   id                   varchar(20) not null comment '唯一标识',
   book_id              varchar(20) not null comment 'www_book唯一标识',
   volume_id            varchar(20) comment 'www_volume 唯一标识',
   chapter_content      text comment '章节内容',
   chapter_words_count  bigint not null comment '字数统计',
   create_time          datetime not null comment '创建时间',
   update_time          datetime not null comment '最后编辑时间'
);

alter table if not exists www_chapter comment '章节';
