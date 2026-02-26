-- =====================================================================================
-- SCHEMA DE BANCO DE DADOS PARA GESTÃO DE IGREJAS (POSTGRESQL / SUPABASE)
-- =====================================================================================
-- Este script cria as tabelas, relacionamentos, políticas de Row Level Security (RLS)
-- e funções necessárias para o funcionamento seguro do sistema.
-- =====================================================================================

-- 1. EXTENSÕES E FUNÇÕES UTILITÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELAS BASE (DOMÍNIOS E USUÁRIOS)

-- Tabela de Igrejas (Permite multi-tenant no futuro, ou apenas os dados da igreja atual)
CREATE TABLE churches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20),
    address TEXT,
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    currency VARCHAR(10) DEFAULT 'BRL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Perfis de Usuário (Roles)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE, -- 'Administrador', 'Pastor', 'Tesoureiro', 'Líder'
    description TEXT,
    permissions JSONB DEFAULT '{}'::jsonb -- Permissões granulares
);

-- Tabela de Membros/Usuários
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    church_id UUID REFERENCES churches(id) ON DELETE CASCADE,
    auth_user_id UUID UNIQUE, -- Link com a tabela de autenticação (ex: auth.users do Supabase)
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    address TEXT,
    status VARCHAR(20) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo', 'Em Disciplina')),
    role_id UUID REFERENCES roles(id),
    join_date DATE DEFAULT CURRENT_DATE,
    avatar_url TEXT,
    accepted_privacy_terms BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MÓDULO: GRUPOS PEQUENOS (CÉLULAS)
CREATE TABLE small_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    church_id UUID REFERENCES churches(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    leader_id UUID REFERENCES members(id),
    address TEXT,
    meeting_day VARCHAR(20), -- 'Segunda-feira', etc.
    meeting_time TIME,
    status VARCHAR(20) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE small_group_members (
    group_id UUID REFERENCES small_groups(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    joined_at DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (group_id, member_id)
);

-- 4. MÓDULO: FINANCEIRO
CREATE TABLE financial_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    church_id UUID REFERENCES churches(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Receita', 'Despesa')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    church_id UUID REFERENCES churches(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Receita', 'Despesa')),
    category_id UUID REFERENCES financial_categories(id),
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Efetivado' CHECK (status IN ('Pendente', 'Efetivado', 'Cancelado')),
    registered_by UUID REFERENCES members(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. MÓDULO: EVENTOS E ESCALAS
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    church_id UUID REFERENCES churches(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255),
    type VARCHAR(50), -- 'Culto', 'Reunião', 'Ação Social'
    status VARCHAR(20) DEFAULT 'Confirmado' CHECK (status IN ('Confirmado', 'Pendente', 'Cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rosters ( -- Escalas
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    team_name VARCHAR(100) NOT NULL, -- 'Louvor', 'Recepção'
    status VARCHAR(20) DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Confirmado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE roster_members (
    roster_id UUID REFERENCES rosters(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    confirmed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (roster_id, member_id)
);

-- 6. MÓDULO: AÇÃO SOCIAL
CREATE TABLE social_beneficiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    church_id UUID REFERENCES churches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    document VARCHAR(20), -- CPF/RG
    family_size INTEGER DEFAULT 1,
    address TEXT,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE social_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    church_id UUID REFERENCES churches(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Cesta Básica', 'Roupas'
    quantity_in_stock INTEGER DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'unidade',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE social_assistances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES social_beneficiaries(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES social_resources(id),
    quantity INTEGER NOT NULL,
    assistance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    registered_by UUID REFERENCES members(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. MÓDULO: EBD (ESCOLA BÍBLICA DOMINICAL)
CREATE TABLE ebd_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    church_id UUID REFERENCES churches(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Jovens', 'Adultos'
    teacher_id UUID REFERENCES members(id),
    room VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ebd_students (
    class_id UUID REFERENCES ebd_classes(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    PRIMARY KEY (class_id, member_id)
);

CREATE TABLE ebd_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES ebd_classes(id) ON DELETE CASCADE,
    class_date DATE NOT NULL,
    topic VARCHAR(255),
    students_present INTEGER DEFAULT 0,
    visitors INTEGER DEFAULT 0,
    bibles_brought INTEGER DEFAULT 0,
    magazines_brought INTEGER DEFAULT 0,
    registered_by UUID REFERENCES members(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. MÓDULO: PATRIMÔNIO
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    church_id UUID REFERENCES churches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- 'Áudio', 'Vídeo', 'Móveis'
    location VARCHAR(100),
    condition VARCHAR(50) DEFAULT 'Bom' CHECK (condition IN ('Bom', 'Regular', 'Ruim', 'Manutenção')),
    purchase_date DATE,
    estimated_value DECIMAL(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. AUDITORIA (LGPD)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    church_id UUID REFERENCES churches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES members(id),
    action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE', 'VIEW_SENSITIVE'
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- =====================================================================================
-- ROW LEVEL SECURITY (RLS) E POLÍTICAS DE ACESSO
-- =====================================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE small_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE small_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_assistances ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebd_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebd_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebd_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para obter a igreja do usuário logado (assumindo JWT com claim church_id)
-- CREATE OR REPLACE FUNCTION auth.church_id() RETURNS UUID AS $$
--   SELECT NULLIF(current_setting('request.jwt.claim.church_id', true), '')::UUID;
-- $$ LANGUAGE SQL STABLE;

-- Função auxiliar para obter a role do usuário logado
-- CREATE OR REPLACE FUNCTION auth.user_role() RETURNS VARCHAR AS $$
--   SELECT r.name FROM members m JOIN roles r ON m.role_id = r.id WHERE m.auth_user_id = auth.uid();
-- $$ LANGUAGE SQL STABLE;

-- NOTA: Como não temos a implementação real do auth.uid() aqui, as políticas abaixo
-- são exemplos conceituais de como os bloqueios devem ser configurados no Supabase/Postgres.

/*
-- EXEMPLOS DE POLÍTICAS (Descomentar e ajustar conforme o provedor de Auth)

-- 1. Isolamento por Igreja (Tenant) - Aplica-se a quase todas as tabelas
CREATE POLICY "Isolamento de Igreja" ON members
    FOR ALL USING (church_id = auth.church_id());

-- 2. Financeiro: Apenas Administradores e Tesoureiros podem ver/editar
CREATE POLICY "Acesso Financeiro Restrito" ON transactions
    FOR ALL USING (
        church_id = auth.church_id() AND 
        auth.user_role() IN ('Administrador', 'Tesoureiro')
    );

-- 3. Membros: Todos podem ver (dados básicos), apenas Admin/Pastor podem editar
CREATE POLICY "Visualização de Membros" ON members
    FOR SELECT USING (church_id = auth.church_id());

CREATE POLICY "Edição de Membros" ON members
    FOR ALL USING (
        church_id = auth.church_id() AND 
        auth.user_role() IN ('Administrador', 'Pastor')
    );

-- 4. Ação Social: Acesso restrito a Admin, Pastor e Líderes específicos
CREATE POLICY "Acesso Ação Social" ON social_beneficiaries
    FOR ALL USING (
        church_id = auth.church_id() AND 
        auth.user_role() IN ('Administrador', 'Pastor', 'Líder')
    );

-- 5. Escalas: Voluntários podem ver suas próprias escalas, Líderes podem editar
CREATE POLICY "Ver próprias escalas" ON roster_members
    FOR SELECT USING (member_id = (SELECT id FROM members WHERE auth_user_id = auth.uid()));

-- 6. Auditoria (LGPD): Apenas Administradores podem visualizar logs
CREATE POLICY "Logs apenas para Admin" ON audit_logs
    FOR SELECT USING (
        church_id = auth.church_id() AND 
        auth.user_role() = 'Administrador'
    );
*/

-- =====================================================================================
-- TRIGGERS E FUNÇÕES AUTOMÁTICAS
-- =====================================================================================

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_members_modtime BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_churches_modtime BEFORE UPDATE ON churches FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Atualizar estoque de recursos sociais ao registrar assistência
CREATE OR REPLACE FUNCTION update_social_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE social_resources 
    SET quantity_in_stock = quantity_in_stock - NEW.quantity
    WHERE id = NEW.resource_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_social_stock 
AFTER INSERT ON social_assistances 
FOR EACH ROW EXECUTE FUNCTION update_social_stock();
