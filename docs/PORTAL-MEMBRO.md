# Portal do Membro

## Acesso

- URL: `/portal/login`
- Credenciais: **CPF** (somente números ou formatado) ou **e-mail** cadastrado + **senha**
- O portal precisa ser **ativado** pelo administrador na ficha do membro

## Ativar portal (admin)

1. Abra `/membros/[id]`
2. Clique em **Ativar portal** ou **Redefinir senha portal**
3. Defina uma senha (mín. 6 caracteres)

## O que o membro pode alterar

- Foto (URL)
- Telefone, WhatsApp, e-mail
- Endereço completo (CEP, rua, número, etc.)

## O que o membro visualiza

| Seção | Rota |
|-------|------|
| Dashboard | `/portal` |
| Perfil | `/portal/perfil` |
| Frequência EBD | `/portal/ebd` |
| Eventos | `/portal/eventos` |
| Cultos | `/portal/cultos` |
| Carteirinha | `/portal/carteirinha` |
| Histórico | `/portal/historico` |

## Variáveis de ambiente

```env
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Dados de demonstração

Na primeira visita ao dashboard, registros de exemplo (EBD, cultos, histórico, eventos) são criados se o membro ainda não tiver dados — facilita testes até os módulos administrativos serem implementados.
