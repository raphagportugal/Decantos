# Bootstrap do primeiro moderador

Este procedimento é feito uma única vez, direto no Supabase, para abrir a curadoria inicial do Decantos.

## 1. Criar o usuário no Supabase Auth

No painel do Supabase:

1. Acesse **Authentication**.
2. Crie um novo usuário com email e senha.
3. Abra o usuário criado.
4. Copie o valor de `User UID`.

Esse valor será usado como `auth_user_id`.

## 2. Criar o profile moderator

No SQL Editor do Supabase, rode:

```sql
insert into public.profiles (
  auth_user_id,
  nome,
  email,
  role,
  ativo
)
values (
  'COLE_AQUI_O_USER_UID',
  'Nome do Moderador',
  'email@exemplo.com',
  'moderator',
  true
);
```

Troque `COLE_AQUI_O_USER_UID`, o nome e o email pelos dados reais do usuário criado no Auth.

## 3. Acessar o admin

Depois disso:

1. Entre pelo site em `/entrar`.
2. Faça login com o email e senha do usuário criado.
3. O Decantos deve encaminhar o moderador para `/admin`.

A partir daí, o moderador pode alterar papéis e ativar ou desativar perfis pelo painel.
