import "reflect-metadata";

import { createConnection, Table } from "typeorm";
import { MarketplaceListing } from "./entities/test-entity";

createConnection({
    type: "sqlite",
    database: "./local.db",
    logging: true,
    entities: [MarketplaceListing]
})
    .then(async connection => {
        const queryRunner = connection.createQueryRunner();

        // -- CREATE TABLE --

        const table = new Table({
            name: "test_entity",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "150",
                    isNullable: false
                },
                {
                    name: "create_time",
                    type: "datetime",
                }
            ]
        });

        await queryRunner.createTable(table);

        // -- INSERT TEST DATA --

        const entityManager = connection.createEntityManager();

        const listingOne = new MarketplaceListing();

        listingOne.id = 1;
        listingOne.name = "Test Listing 1";
        
        const listingTwo = new MarketplaceListing();

        listingTwo.id = 2;
        listingTwo.name = "Test Listing 2";
        
        const listingThree = new MarketplaceListing();

        listingThree.id = 3;
        listingThree.name = "Test Listing 3";

        const listingFour = new MarketplaceListing();

        listingFour.id = 4;
        listingFour.name = "Test Listing 4";
        
        const listingFive = new MarketplaceListing();

        listingFive.id = 5;
        listingFive.name = "Test Listing 5";
        
        await entityManager.save(listingOne),
            await entityManager.save(listingTwo),
            await entityManager.save(listingThree),
            await entityManager.save(listingFour),
            await entityManager.save(listingFive),
            await entityManager.update(
                MarketplaceListing,
                { id: 1 },
                { createdAt: new Date("2018-07-12 12:00:00") }
            );
        await entityManager.update(
            MarketplaceListing,
            { id: 2 },
            { createdAt: new Date("2018-07-23 12:00:00") }
        );
        await entityManager.update(
            MarketplaceListing,
            { id: 3 },
            { createdAt: new Date("2018-07-01 12:00:00") }
        );
        await entityManager.update(
            MarketplaceListing,
            { id: 4 },
            { createdAt: new Date("2018-07-30 12:00:00") }
        );
        await entityManager.update(
            MarketplaceListing,
            { id: 5 },
            { createdAt: new Date("2018-07-31 12:00:00") }
        );

        const query = entityManager
            .getRepository(MarketplaceListing)
            .createQueryBuilder("ml");

        // -- SHOW ALL ENTITIES --

        let result = await query.getMany();

        console.log("--- ALL ENTITIES ---");
        console.log(result);

        query.where(
            "ml.createdAt < :createdAtValue OR ml.createdAt = :createdAtValue AND ml.id < :idValue",
            {
                idValue: 4,
                createdAtValue: new Date("2018-07-30 12:00:00") // this works if passed as "2018-07-30 12:00:00"
            }
        );

        query.orderBy({
            "ml.createdAt": "DESC",
            "ml.id": "ASC"
        });

        // -- SHOW ENTITIES FILTERED --

        result = await query.getMany();

        console.log("--- FILTERED ENTITIES ---");
        console.log(result);

        connection.close();
    })
    .catch(err => console.log(err));
