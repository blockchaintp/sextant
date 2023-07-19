# Completely resetting a Daml on Postgres-ng system

1. Shutdown the daml-on-postgres deployment - otherwise it will interfere with your work

2. There are two schemas in the database you need to be concerned with:

    a. The KV database - usually postgres schema lately

    b. The DAML Index database - usually damlindex

3. Connect to database server:

    a. Connect to the damlindex schema ( \c damlindex )

    b. If you look you will see a set of tables:

     ```bash
     damlindex=> \c damlindex
     psql (14.5 (Ubuntu 14.5-0ubuntu0.22.04.1), server 12.12)
     SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
     You are now connected to database "damlindex" as user "postgres".
     damlindex=> \dt
                         List of relations
     Schema |              Name               | Type  |  Owner
     -------+---------------------------------+-------+----------
     public | configuration_entries           | table | postgres
     public | flyway_schema_history           | table | postgres
     public | package_entries                 | table | postgres
     public | packages                        | table | postgres
     public | parameters                      | table | postgres
     public | participant_command_completions | table | postgres
     public | participant_command_submissions | table | postgres
     public | participant_contract_witnesses  | table | postgres
     public | participant_contracts           | table | postgres
     public | participant_events              | table | postgres
     public | parties                         | table | postgres
     public | party_entries                   | table | postgres
     (12 rows)

     damlindex=>
     ```

    c. You will drop each of those tables:

     ```bash
     drop table configuration_entries;
     drop table flyway_schema_history;
     drop table package_entries;
     drop table packages  ;
     drop table parameters;
     drop table participant_command_completions;
     drop table participant_command_submissions;
     drop table participant_contract_witnesses;
     drop table participant_contracts;
     drop table participant_events;
     drop table parties;
     drop table party_entries;
     ```

    d. You have now reset the damlindex.

    If you restart the daml-on-postgres-ng now, this database will regenerate on the basis of the KV database,
    this can take some time though.

    !!!Warning
        If you are completely resetting the environment, **do not start the daml-on-postgres-ng** and proceed to
        the next step.

4. Connect to the KV database. You will see three tables there:

     ```bash
     damlindex=> \c postgres
     psql (14.5 (Ubuntu 14.5-0ubuntu0.22.04.1), server 12.12)
     SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
     You are now connected to database "postgres" as user "postgres".
     postgres=> \dt
                     List of relations
     Schema |         Name          | Type  |  Owner
     -------+-----------------------+-------+----------
     public | flyway_schema_history | table | postgres
     public | kv                    | table | postgres
     public | tx                    | table | postgres
     (3 rows)

     postgres=>
     ```

5. Drop these tables:

    drop table flyway_schema_history;
    drop table kv;
    drop table tx;

6. Drop the pgcrypto extension:

    drop extension pgcrypto;

7. You have now reset the database.  When you restart the daml-on-postgres-ng the tables will be
   regenerated in both schemas.

    !!!Note
        Please take note: Parties and packages are also gone.
