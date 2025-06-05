# São 4 Etapas para configurar o projeto

### 1. Suba os containers dos bancos de dados
```bash
npm run up
```

### 2. Configure o Master (Criar usuário de réplica)
```bash
# Acessando o container MASTER
docker exec -it db-gerenciado-master bash
mysql -u root -p      # senha: root

# Criando usuário de réplica
UNLOCK TABLES;
DROP USER IF EXISTS 'replica'@'%';
CREATE USER 'replica'@'%' IDENTIFIED WITH mysql_native_password BY 'replica_pass';
GRANT REPLICATION SLAVE ON *.* TO 'replica'@'%';
FLUSH PRIVILEGES;
FLUSH TABLES WITH READ LOCK;
SHOW MASTER STATUS;

# OBS: Salve os valores de `File` e `Position`. Ex.:
mysql> SHOW MASTER STATUS;
+------------------+----------+--------------+------------------+-------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+-------------------+
| mysql-bin.000003 |   209425 | aula-db      |                  |                   |
+------------------+----------+--------------+------------------+-------------------+
1 row in set (0.00 sec)
```

### 3. Configure o Slave
```bash
# Acessando o container SLAVE
docker exec -it db-gerenciado-slave bash
mysql -u root -p      # senha: root

# Configurando conexão da réplica
STOP SLAVE;
CHANGE MASTER TO
  MASTER_HOST='db-master',
  MASTER_USER='replica',
  MASTER_PASSWORD='replica_pass',
  MASTER_LOG_FILE='mysql-bin.000003', -- use o valor de File
  MASTER_LOG_POS=209425;                -- use o valor de Position
START SLAVE;

# Verificando status da conexão
SHOW SLAVE STATUS\G

# Estará tudo certo se
# os seguintes campos estiverem com esses valores:
Slave_IO_Running: Yes
Slave_SQL_Running: Yes
Slave_IO_State: Waiting for source to send event
Seconds_Behind_Master: 0
```

### 4. Inicie a Aplicação e teste a réplica
```bash
npm i
npm start
```