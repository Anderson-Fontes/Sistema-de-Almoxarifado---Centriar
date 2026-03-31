--
-- PostgreSQL database dump
--

\restrict uvy2VaidWqgG7foQ4mOuZFInUvuwKPPrZ1lldg8kWsZbRSKC7oAOhalOkjcY7Hs

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-03-31 17:05:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16464)
-- Name: agendamentos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agendamentos (
    id integer NOT NULL,
    colaborador_id integer,
    epi_id integer,
    quantidade numeric(10,2) DEFAULT 1,
    data_agendada timestamp without time zone NOT NULL,
    status character varying(50) DEFAULT 'AGENDADO'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    destino character varying(255) DEFAULT 'Uso Contínuo'::character varying
);


--
-- TOC entry 225 (class 1259 OID 16463)
-- Name: agendamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.agendamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 225
-- Name: agendamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.agendamentos_id_seq OWNED BY public.agendamentos.id;


--
-- TOC entry 222 (class 1259 OID 16431)
-- Name: colaboradores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.colaboradores (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    setor character varying(100),
    status character varying(50) DEFAULT 'Ativo'::character varying
);


--
-- TOC entry 221 (class 1259 OID 16430)
-- Name: colaboradores_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.colaboradores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 221
-- Name: colaboradores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.colaboradores_id_seq OWNED BY public.colaboradores.id;


--
-- TOC entry 220 (class 1259 OID 16388)
-- Name: epis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.epis (
    id integer NOT NULL,
    codigo_identificacao character varying(50),
    nome character varying(100) NOT NULL,
    categoria character varying(50),
    numero_ca character varying(50),
    validade_ca date,
    quantidade numeric(10,2) DEFAULT 0,
    peso numeric(10,2),
    comprimento numeric(10,2),
    estoque_minimo numeric(10,2) DEFAULT 5,
    peso_minimo numeric(10,2) DEFAULT 0,
    estado character varying(50) DEFAULT 'Novo'::character varying,
    bitola character varying(20) DEFAULT '1/4'::character varying,
    nivel_pacote character varying(50),
    voltagem character varying(50),
    gas_refrigerante character varying(50),
    btu character varying(50),
    tecnologia character varying(50)
);


--
-- TOC entry 219 (class 1259 OID 16387)
-- Name: epis_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.epis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5076 (class 0 OID 0)
-- Dependencies: 219
-- Name: epis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.epis_id_seq OWNED BY public.epis.id;


--
-- TOC entry 224 (class 1259 OID 16441)
-- Name: movimentacoes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movimentacoes (
    id integer NOT NULL,
    colaborador_id integer,
    epi_id integer,
    quantidade_retirada numeric(10,2) DEFAULT 1,
    medida_inicial numeric(10,2),
    medida_final numeric(10,2),
    consumo numeric(10,2),
    data_retirada timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    data_devolucao timestamp without time zone,
    status character varying(50) DEFAULT 'EM_USO'::character varying,
    epi_nome character varying(255),
    destino character varying(255) DEFAULT 'Uso Contínuo'::character varying
);


--
-- TOC entry 223 (class 1259 OID 16440)
-- Name: movimentacoes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.movimentacoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5077 (class 0 OID 0)
-- Dependencies: 223
-- Name: movimentacoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.movimentacoes_id_seq OWNED BY public.movimentacoes.id;


--
-- TOC entry 228 (class 1259 OID 16520)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    cpf character varying(18) NOT NULL,
    senha character varying(255) NOT NULL,
    perfil character varying(20) DEFAULT 'VISUALIZADOR'::character varying
);


--
-- TOC entry 227 (class 1259 OID 16519)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5078 (class 0 OID 0)
-- Dependencies: 227
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4889 (class 2604 OID 16467)
-- Name: agendamentos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamentos ALTER COLUMN id SET DEFAULT nextval('public.agendamentos_id_seq'::regclass);


--
-- TOC entry 4882 (class 2604 OID 16434)
-- Name: colaboradores id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.colaboradores ALTER COLUMN id SET DEFAULT nextval('public.colaboradores_id_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 16391)
-- Name: epis id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.epis ALTER COLUMN id SET DEFAULT nextval('public.epis_id_seq'::regclass);


--
-- TOC entry 4884 (class 2604 OID 16444)
-- Name: movimentacoes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimentacoes ALTER COLUMN id SET DEFAULT nextval('public.movimentacoes_id_seq'::regclass);


--
-- TOC entry 4894 (class 2604 OID 16523)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 5066 (class 0 OID 16464)
-- Dependencies: 226
-- Data for Name: agendamentos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.agendamentos (id, colaborador_id, epi_id, quantidade, data_agendada, status, criado_em, destino) FROM stdin;
2	5	38	12.00	2026-03-27 17:30:00	RETIRADO	2026-03-27 11:40:04.214205	Camara de SJC
3	5	8	1.00	2026-03-30 07:45:00	RETIRADO	2026-03-30 11:18:12.344733	CEA - Lorena
\.


--
-- TOC entry 5062 (class 0 OID 16431)
-- Dependencies: 222
-- Data for Name: colaboradores; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.colaboradores (id, nome, setor, status) FROM stdin;
2	Fabricio de Oliveira Gomes	Aux. Adm. Jr.	Ativo
1	Anderson Fontes Fernandes Júnior	Aux. Adm. Jr.	Ativo
4	Leandro das Chagas dos Santos	Líder de Manutenção	Ativo
5	Junio de Souza Alves	Mecânico de Refrigeração	Ativo
6	André Luiz Carvalho Junior	Ajudante Geral	Ativo
7	Agnaldo Severo Alcantra de Oliveira	Mecânico	Ativo
8	Carlos Henrique Pinheiro	Diretor	Ativo
9	César Florencio de Souza	Diretor	Ativo
10	Deusdete Ferreira Freitas	Ajudante Geral	Ativo
11	Luciano Alves Dias	Ajudante Geral	Ativo
3	Gustavo Christian Menezes dos Reis	Ajudante Geral	Ativo
12	Pablo dos Santos Ramos 	Lider de Manutenção	Ativo
13	Fernando Luis Esper	Diretor	Ativo
\.


--
-- TOC entry 5060 (class 0 OID 16388)
-- Dependencies: 220
-- Data for Name: epis; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.epis (id, codigo_identificacao, nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento, estoque_minimo, peso_minimo, estado, bitola, nivel_pacote, voltagem, gas_refrigerante, btu, tecnologia) FROM stdin;
6	P-1	Panqueca de Cobre de 1/2	Cobre		\N	1.00	2.22	8.71	1.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
7	P-2	Panqueca de Cobre de 1/2	Cobre		\N	1.00	1.40	5.47	1.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
8	P-3	Panqueca de Cobre de 1/2	Cobre		\N	1.00	0.95	3.73	5.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
9	P-4	Panqueca de Cobre de 1/2	Cobre		\N	1.00	3.32	13.02	5.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
10	P-5	Panqueca de Cobre de 1/2	Cobre		\N	1.00	4.15	16.27	5.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
12	P-7	Panqueca de Cobre de 1/2	Cobre		\N	1.00	4.29	16.80	5.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
11	P-6	Panqueca de Cobre de 1/2	Cobre		\N	1.00	4.29	16.80	5.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
13	P-8	Panqueca de Cobre de 1/2	Cobre		\N	1.00	4.16	16.31	5.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
5	PQ-01	Paquimetro Digital	Ferramenta		\N	1.00	\N	\N	0.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
14	\N	Protetor Auricular	EPI	10.043	2026-07-16	100.00	\N	\N	20.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
17	\N	Óculos de Proteção Incolor	EPI	10.346	2029-03-08	1.00	\N	\N	0.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
16	\N	Óculos de Proteção Incolor	EPI	28.018	2030-05-30	18.00	\N	\N	5.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
18	\N	Óculos de Proteção Incolor de Sobreposição	EPI	50.607	2029-01-31	1.00	\N	\N	0.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
19	\N	Óculos de Proteção Incolor de Sobreposição	EPI	10.344	2029-03-11	3.00	\N	\N	0.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
20	\N	Óculos Escuros de Proteção de Sobreposição	EPI	10.344	2029-03-11	7.00	\N	\N	0.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
21	\N	Óculos de Proteção Incolor	EPI	39878	2027-03-14	1.00	\N	\N	0.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
23	\N	Par de Luvas Pretas PU	EPI	15.272	2029-12-30	9.00	\N	\N	2.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
22	\N	Par de Luvas Pretas PU	EPI	41.123	2030-07-20	8.00	\N	\N	5.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
25	\N	Par de Luvas Latex Amarela	EPI	40.044	2031-02-04	2.00	\N	\N	0.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
26	\N	Par de Luvas Latex Preta	EPI	3.890	2030-03-25	2.00	\N	\N	0.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
27	\N	Par de Luvas Latex Verde	EPI	32.069	2027-02-01	11.00	\N	\N	5.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
28	\N	Par de Luvas Tricot. com Pigmento	EPI	40.832	2027-11-09	2.00	\N	\N	1.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
29	\N	Par de Mangote de Segurança	EPI	35065	2030-04-28	2.00	\N	\N	1.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
30	\N	Protetor Auricular	EPI	51772	2029-12-07	4.00	\N	\N	0.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
31	\N	Máscara PFF2 com Válvula	EPI	45.021	2026-07-05	115.00	\N	\N	20.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
32	\N	Máscara PFF2 com Válvula	EPI	38.503	2030-01-05	10.00	\N	\N	0.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
24	\N	Par de Luvas Latex Amarela	EPI	45.628	2026-03-11	8.00	\N	\N	2.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
35	\N	Vareta de Solda Phoscoperr	Consumível		\N	32.00	\N	\N	5.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
36	\N	Fita Dupla Face 20m	Consumível		\N	1.00	\N	\N	0.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
37	\N	Puxa Fio 10m	Ferramenta		\N	2.00	\N	\N	1.00	0.00	Bom Estado	1/4	\N	\N	\N	\N	\N
39	\N	Refil de Gás MAP	Consumível		\N	10.00	\N	\N	5.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
38	\N	Parafuso Sextavado de 1/4 - Bucha 10	Consumível		\N	188.00	\N	\N	50.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
40	\N	Colete Refletivo	EPI		\N	7.00	\N	\N	2.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
42	21	Capacete de Segurança Verde  (sem jugular)	EPI	31469	2028-05-23	1.00	\N	\N	0.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
43	08	Capacete de Segurança Branco (sem jugular)	EPI	31469	2028-05-23	1.00	\N	\N	0.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
41	20	Capacete de Segurança Turtle Branco  (sem jugular)	EPI	35.983	2026-07-04	1.00	\N	\N	0.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
44	01	Capacete de Segurança Branco (sem jugular)	EPI	31469	2028-05-23	1.00	\N	\N	0.00	0.00	Bom Estado	1/4	\N	\N	\N	\N	\N
45	17	Capacete de Segurança Branco (sem jugular)	EPI	29.792	2026-06-29	1.00	\N	\N	0.00	0.00	Bom Estado	1/4	\N	\N	\N	\N	\N
46	22	Capacete de Segurança Branco (sem jugular)	EPI	29.792	2026-06-29	1.00	\N	\N	0.00	0.00	Bom Estado	1/4	\N	\N	\N	\N	\N
47	18	Capacete de Segurança Branco (sem jugular)	EPI	29.792	2026-06-29	1.00	\N	\N	0.00	0.00	Bom Estado	1/4	\N	\N	\N	\N	\N
48	23	Capacete de Segurança Branco (sem jugular)	EPI	29.792	2026-06-29	1.00	\N	\N	0.00	0.00	Bom Estado	1/4	\N	\N	\N	\N	\N
49	11	Capacete de Segurança Branco (sem jugular)	EPI	29.792	2026-06-29	1.00	\N	\N	0.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
50	24	Capacete de Segurança Branco (sem jugular)	EPI	29.792	2026-06-29	1.00	\N	\N	0.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
51	25	Capacete de Segurança Branco (sem jugular)	EPI	29.792	2026-06-29	1.00	\N	\N	0.00	0.00	Bom Estado	1/4	\N	\N	\N	\N	\N
52	16	Capacete de Segurança Branco (sem jugular)	EPI	29.792	2026-06-29	1.00	\N	\N	0.00	0.00	Bom Estado	1/4	\N	\N	\N	\N	\N
53	26	Capacete de Segurança Branco (com jugular)	EPI	498	2028-01-09	1.00	\N	\N	0.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
54	27	Capacete de Segurança Branco 	EPI	35.983	2026-07-04	1.00	\N	\N	0.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
56	28	Capacete de Segurança Branco (com jugular) + abafador	EPI	35.983	2026-07-04	1.00	\N	\N	0.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
57	28	Par de Abafadores + capacete 28	EPI	15624	2029-12-02	1.00	\N	\N	0.00	0.00	Bom Estado	1/4	\N	\N	\N	\N	\N
55	06	Capacete de Segurança Branco (com jugular) (C.A. Renovado)	EPI	31.469	2028-05-23	1.00	\N	\N	0.00	0.00	Marcas de Uso	1/4	\N	\N	\N	\N	\N
58	\N	Paquimetro Mecânico	Ferramenta		\N	1.00	\N	\N	0.00	0.00	Bom Estado	1/4	\N	\N	\N	\N	\N
59	\N	Controle Universal para Ar Condicionado EOS	Consumível		\N	5.00	\N	\N	3.00	0.00	Novo	1/4	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5064 (class 0 OID 16441)
-- Dependencies: 224
-- Data for Name: movimentacoes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.movimentacoes (id, colaborador_id, epi_id, quantidade_retirada, medida_inicial, medida_final, consumo, data_retirada, data_devolucao, status, epi_nome, destino) FROM stdin;
5	4	5	1.00	\N	\N	\N	2026-03-26 09:10:05.970925	\N	EM_USO	Paquimetro Digital	Uso Contínuo
18	5	38	12.00	\N	\N	12.00	2026-03-30 08:28:45.10007	2026-03-30 08:28:55.917981	DEVOLVIDO	Parafuso Sextavado de 1/4 - Bucha 10	Camara de SJC
19	5	8	1.00	0.95	\N	\N	2026-03-30 16:02:23.53113	\N	EM_USO	Panqueca de Cobre de 1/2	CEA - Lorena
\.


--
-- TOC entry 5068 (class 0 OID 16520)
-- Dependencies: 228
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, nome, cpf, senha, perfil) FROM stdin;
1	Administrador Centriar	000.000.000-00	admin123	ADMIN
\.


--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 225
-- Name: agendamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.agendamentos_id_seq', 3, true);


--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 221
-- Name: colaboradores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.colaboradores_id_seq', 13, true);


--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 219
-- Name: epis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.epis_id_seq', 59, true);


--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 223
-- Name: movimentacoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.movimentacoes_id_seq', 19, true);


--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 227
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);


--
-- TOC entry 4903 (class 2606 OID 16474)
-- Name: agendamentos agendamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_pkey PRIMARY KEY (id);


--
-- TOC entry 4899 (class 2606 OID 16439)
-- Name: colaboradores colaboradores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.colaboradores
    ADD CONSTRAINT colaboradores_pkey PRIMARY KEY (id);


--
-- TOC entry 4897 (class 2606 OID 16397)
-- Name: epis epis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.epis
    ADD CONSTRAINT epis_pkey PRIMARY KEY (id);


--
-- TOC entry 4901 (class 2606 OID 16450)
-- Name: movimentacoes movimentacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimentacoes
    ADD CONSTRAINT movimentacoes_pkey PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 16532)
-- Name: usuarios usuarios_cpf_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_cpf_key UNIQUE (cpf);


--
-- TOC entry 4907 (class 2606 OID 16530)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4910 (class 2606 OID 16475)
-- Name: agendamentos agendamentos_colaborador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_colaborador_id_fkey FOREIGN KEY (colaborador_id) REFERENCES public.colaboradores(id);


--
-- TOC entry 4911 (class 2606 OID 16480)
-- Name: agendamentos agendamentos_epi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agendamentos
    ADD CONSTRAINT agendamentos_epi_id_fkey FOREIGN KEY (epi_id) REFERENCES public.epis(id);


--
-- TOC entry 4908 (class 2606 OID 16451)
-- Name: movimentacoes movimentacoes_colaborador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimentacoes
    ADD CONSTRAINT movimentacoes_colaborador_id_fkey FOREIGN KEY (colaborador_id) REFERENCES public.colaboradores(id);


--
-- TOC entry 4909 (class 2606 OID 16456)
-- Name: movimentacoes movimentacoes_epi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimentacoes
    ADD CONSTRAINT movimentacoes_epi_id_fkey FOREIGN KEY (epi_id) REFERENCES public.epis(id);


-- Completed on 2026-03-31 17:05:55

--
-- PostgreSQL database dump complete
--

\unrestrict uvy2VaidWqgG7foQ4mOuZFInUvuwKPPrZ1lldg8kWsZbRSKC7oAOhalOkjcY7Hs

