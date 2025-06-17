<?php

namespace Database\Seeders;

use Faker\Factory as FakerFactory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run(): void
    {
        $faker = FakerFactory::create();
        $faker->seed(123);

        for ($i = 0; $i < 1000; $i++) {
            $dt = $faker->dateTimeThisYear()->format('Y-m-d H:i:s');
            DB::table('customers')->insert([
                'first_name' => $faker->firstName(),
                'last_name' => $faker->lastName(),
                'email' => $faker->unique()->email,
                'created_at' => $dt,
                'updated_at' => $dt
            ]);
        }


        $dt = $faker->dateTimeThisYear()->format('Y-m-d H:i:s');
        DB::table('siso_codes')->insert([
            'siso_code' => 'ROMAN',
            'description' => 'Romans',
            'created_at' => $dt,
            'updated_at' => $dt
        ]);
        $dt = $faker->dateTimeThisYear()->format('Y-m-d H:i:s');
        DB::table('siso_codes')->insert([
            'siso_code' => '845',
            'description' => 'Spreekwoorden en zegswijzen',
            'created_at' => $dt,
            'updated_at' => $dt
        ]);

        DB::table('authors')->insert(['first_name' => 'Ed', 'last_name' => 'van Eeden']); // 1

        DB::table('books')->insert([ // 1
            'title' => 'Groot spreekwoordenboek',
            'publisher' => 'Deltas',
            'content' => 'Een uitgebreid spreekwoordenboek, eerst alfabetisch geordend, daarna
verdeeld over 24 levensgebieden. Steeds wordt naar het andere gedeelte
verwezen. Bij de spreekwoorden wordt een duidelijke uitleg gegeven, bij
uitdrukkingen wordt steeds een voorbeeld opgenomen. De schrijver heeft
veel publicaties op zijn naam. De tekst \'alle bekende spreekwoorden\' op het
omslag is natuurlijk wat overmoedig. Onveranderde herdruk. Oorspronkelijk
uitgebracht onder de naam \'Deltas Groot Spreekwoordenboek\' uit 1989.
Kleine letter; krappe marge.',
            'author_id' => 1,
            'siso_code' => '845'
        ]);

        DB::table('copies')->insert([ //1
            'book_id' => 1,
            'created_at' => $dt,
            'updated_at' => $dt
        ]);

        DB::table('copies')->insert([ //2
            'book_id' => 1,
            'created_at' => $dt,
            'updated_at' => $dt
        ]);


        DB::table('copy_customer')->insert([
            'copy_id' => 1,
            'customer_id' => 263,
            'borrowing_start' => '2023-08-24',
            'borrowing_end' => null,

        ]);

        DB::table('authors')->insert(['first_name' => 'Willem Frederik', 'last_name' => 'Hermans']); // 2

        DB::table('books')->insert([ // 2
            'title' => 'De donkere kamer van Damokles',
            'publisher' => 'Van Oorschot',
            'content' => 'Hoofdpersoon Osewoudt krijgt op de dag dat Nederland capituleert voor Nazi-Duitsland, bezoek van een Nederlandse officier Dorbeck, die sprekend op hem lijkt en met wie hij meteen een onverklaarbare verbintenis voelt. Dorbeck geeft Osewoudt opdrachten, die hem een prominente rol in de verzetswereld bezorgen. Als Osewoudt in 1945 ontsnapt uit Duits gevangenschap en vlucht naar de bevrijde gebieden, wordt hij daar opgepakt, en blijkt dat hij juist van landverraad wordt beschuldigd. Nergens zijn aanwijzingen te vinden voor het bestaan van de persoon Dorbeck, en Osewoudt raakt verstrikt in zijn eigen belevingswereld.',
            'author_id' => 2,
            'siso_code' => 'ROMAN'
        ]);

        DB::table('copies')->insert([ //3
            'book_id' => 2,
            'created_at' => $dt,
            'updated_at' => $dt
        ]);


        DB::table('copy_customer')->insert([
            'copy_id' => 3,
            'customer_id' => 263,
            'borrowing_start' => '2023-08-01',
            'borrowing_end' => '2023-08-20',
        ]);

        DB::table('copy_customer')->insert([
            'copy_id' => 3,
            'customer_id' => 123,
            'borrowing_start' => '2023-07-01',
            'borrowing_end' => '2023-07-20',
        ]);

        DB::table('books')->insert([ // 3
            'title' => 'Nooit meer slapen',
            'publisher' => 'De Bezige Bij',
            'content' => 'Een jonge geoloog gaat naar Noorwegen voor zijn promotieonderzoek. De tocht wordt een fiasco: hij heeft geen toegang tot benodigd materiaal, kan zijn collega\'s nauwelijks bijhouden op expeditie, en wordt geplaagd door de altijd aanwezige muggen. Bovendien blijkt dat de hypothese van zijn promotor al 20 jaar de risee van de geologie is. Hij komt zonder resultaten en een paar illusies armer terug, in het besef dat hij al die tijd vooral probeerde zijn vader te overtreffen.',
            'author_id' => 2,
            'siso_code' => 'ROMAN'
        ]);

        DB::table('copies')->insert([ //4
            'book_id' => 3,
            'created_at' => $dt,
            'updated_at' => $dt
        ]);

        DB::table('copy_customer')->insert([
            'copy_id' => 4,
            'customer_id' => 123,
            'borrowing_start' => '2023-08-20',
            'borrowing_end' => null,
        ]);

        DB::table('authors')->insert(['first_name' => 'Michel', 'last_name' => 'Houellebecq']); // 3

        DB::table('books')->insert([ // 4
            'title' => 'Elementaire deeltjes',
            'publisher' => 'de Arbeiderspers',
            'content' => 'Elementaire deeltjes is het verhaal van de twee halfbroers Bruno en Michel, kinderen van eenzelfde moeder, die half verweesd los van elkaar opgroeien en elkaar pas later leren kennen. De in zijn schooltijd gekwelde Bruno ontwikkelt zich tot een ziekelijk aan seks verslaafde genotzoeker. De eenzame ziel Michel groeit uit tot een briljant moleculair bioloog, wiens onderzoekingen uiteindelijk zullen leiden tot de vervanging van de mens door een nieuwe, niet-individualistische soort. De levenswegen van de twee broers zijn exemplarisch voor het morele bankroet van de liberale westerse samenleving, waarvan Houellebecq op visionaire wijze het einde aankondigt.',
            'author_id' => 3,
            'siso_code' => 'ROMAN'
        ]);

        DB::table('copies')->insert([ //5
            'book_id' => 4,
            'created_at' => $dt,
            'updated_at' => $dt
        ]);


        DB::table('copy_customer')->insert([
            'copy_id' => 5,
            'customer_id' => 621,
            'borrowing_start' => '2023-08-01',
            'borrowing_end' => '2023-08-20',
        ]);


        $dt = $faker->dateTimeThisYear()->format('Y-m-d H:i:s');
        DB::table('siso_codes')->insert([
            'siso_code' => '527.8',
            'description' => 'Kunstmatige intelligentie',
            'created_at' => $dt,
            'updated_at' => $dt
        ]);
        for ($i = 0; $i < 20; $i++) {
            $id = DB::table('authors')->insertGetId(['first_name' => $faker->firstName(), 'last_name' => $faker->lastName()]); // 3

            $id = DB::table('books')->insertGetId([ // 4
                'title' => $faker->sentence(),
                'publisher' => $faker->words(2, true),
                'content' => $faker->realText(800, 3),
                'author_id' => $id,
                'siso_code' => '527.8'
            ]);
            $dt = $faker->dateTimeThisYear()->format('Y-m-d H:i:s');
            DB::table('copies')->insert([
                'book_id' => $id,
                'created_at' => $dt,
                'updated_at' => $dt
            ]);
        }

        $dt = $faker->dateTimeThisYear()->format('Y-m-d H:i:s');
        DB::table('siso_codes')->insert([
            'siso_code' => '528.52',
            'description' => 'Ontwerpen, programmeren en beheren van websites',
            'created_at' => $dt,
            'updated_at' => $dt
        ]);
        for ($i = 0; $i < 20; $i++) {
            $id = DB::table('authors')->insertGetId(['first_name' => $faker->firstName(), 'last_name' => $faker->lastName()]); // 3

            $id = DB::table('books')->insertGetId([ // 4
                'title' => $faker->sentence(),
                'publisher' => $faker->words(2, true),
                'content' => $faker->realText(800, 3),
                'author_id' => $id,
                'siso_code' => '528.52'
            ]);
            $dt = $faker->dateTimeThisYear()->format('Y-m-d H:i:s');
            DB::table('copies')->insert([
                'book_id' => $id,
                'created_at' => $dt,
                'updated_at' => $dt
            ]);
        }

    }
}
