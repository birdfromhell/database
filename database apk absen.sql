PGDMP  )                     }            absensi_sekola    16.6    16.6     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16410    absensi_sekola    DATABASE     �   CREATE DATABASE absensi_sekola WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Indonesian_Indonesia.1252';
    DROP DATABASE absensi_sekola;
                postgres    false            �            1259    16640 
   attendance    TABLE       CREATE TABLE public.attendance (
    id integer NOT NULL,
    date date NOT NULL,
    status character varying(50) NOT NULL,
    user_id integer NOT NULL,
    school_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.attendance;
       public         heap    postgres    false            �            1259    16639    attendance_id_seq    SEQUENCE     �   CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.attendance_id_seq;
       public          postgres    false    220            �           0    0    attendance_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;
          public          postgres    false    219            �            1259    16518    schools    TABLE     c   CREATE TABLE public.schools (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);
    DROP TABLE public.schools;
       public         heap    postgres    false            �            1259    16517    schools_id_seq    SEQUENCE     �   CREATE SEQUENCE public.schools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.schools_id_seq;
       public          postgres    false    216            �           0    0    schools_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.schools_id_seq OWNED BY public.schools.id;
          public          postgres    false    215            �            1259    16525    users    TABLE        CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    school_id integer,
    remember_token character varying(255)
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16524    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    218            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    217            &           2604    16643    attendance id    DEFAULT     n   ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);
 <   ALTER TABLE public.attendance ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            $           2604    16521 
   schools id    DEFAULT     h   ALTER TABLE ONLY public.schools ALTER COLUMN id SET DEFAULT nextval('public.schools_id_seq'::regclass);
 9   ALTER TABLE public.schools ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            %           2604    16528    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            �          0    16640 
   attendance 
   TABLE DATA           V   COPY public.attendance (id, date, status, user_id, school_id, created_at) FROM stdin;
    public          postgres    false    220   !       �          0    16518    schools 
   TABLE DATA           +   COPY public.schools (id, name) FROM stdin;
    public          postgres    false    216   $!       �          0    16525    users 
   TABLE DATA           Y   COPY public.users (id, username, password, email, school_id, remember_token) FROM stdin;
    public          postgres    false    218   n!       �           0    0    attendance_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.attendance_id_seq', 1, false);
          public          postgres    false    219            �           0    0    schools_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.schools_id_seq', 2, true);
          public          postgres    false    215            �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 2, true);
          public          postgres    false    217            1           2606    16646    attendance attendance_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.attendance DROP CONSTRAINT attendance_pkey;
       public            postgres    false    220            )           2606    16523    schools schools_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.schools DROP CONSTRAINT schools_pkey;
       public            postgres    false    216            +           2606    16536    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    218            -           2606    16532    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    218            /           2606    16534    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    218            3           2606    16652 $   attendance attendance_school_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);
 N   ALTER TABLE ONLY public.attendance DROP CONSTRAINT attendance_school_id_fkey;
       public          postgres    false    4649    220    216            4           2606    16647 "   attendance attendance_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 L   ALTER TABLE ONLY public.attendance DROP CONSTRAINT attendance_user_id_fkey;
       public          postgres    false    218    4653    220            2           2606    16537    users users_school_id_fkey    FK CONSTRAINT     }   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);
 D   ALTER TABLE ONLY public.users DROP CONSTRAINT users_school_id_fkey;
       public          postgres    false    216    4649    218            �      x������ � �      �   :   x�3���VpI��W�M,*I-N�����2�����e*+8%楔�s��qqq ��      �   �   x�U��
�0  ��|��V��J��4�$m�EsY2��hO����d�}'�Q*Õ̔`��p4Ť����b��$�Y$�ߚ�(�ޜc���ayr�%ٱ))kΔ�(�+!бJ�e=��M��;�B�>�C�I��Xtϵ������g�_}�ׯ�����I�>==     