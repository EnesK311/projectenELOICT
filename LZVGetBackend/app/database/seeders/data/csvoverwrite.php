<?php

// Define input and output CSV file paths
$inputFile = 'PlayerSheet.csv'; // Replace with your actual input file path
$outputFile = 'output.csv'; // Replace with your desired output file path

function processCSV($inputFile, $outputFile)
{
    // Open the input file for reading
    if (($inputHandle = fopen($inputFile, 'r')) === false) {
        die("Error: Unable to open input file.\n");
    }

    // Open the output file for writing
    if (($outputHandle = fopen($outputFile, 'w')) === false) {
        fclose($inputHandle);
        die("Error: Unable to open output file.\n");
    }

    // Read the header row from the input file
    $header = fgetcsv($inputHandle);
    if ($header === false) {
        fclose($inputHandle);
        fclose($outputHandle);
        die("Error: Unable to read header row.\n");
    }

    // Write the header row to the output file
    fputcsv($outputHandle, $header);

    // Process each row of the CSV
    while (($row = fgetcsv($inputHandle)) !== false) {
        $rowAssoc = array_combine($header, $row);

        // Check if the email field contains only stars
        if ($rowAssoc['email'] === '***@***.***') {
            $firstName = trim($rowAssoc['first_name']);
            $lastName = trim($rowAssoc['last_name']);
            if (!empty($firstName) && !empty($lastName)) {
                $rowAssoc['email'] = strtolower($firstName) . '@' . strtolower($lastName) . '.com';
            } else {
                echo "Skipping row with ID {$rowAssoc['id']} due to missing first or last name.\n";
            }
        }

        // Write the updated row to the output file
        fputcsv($outputHandle, $rowAssoc);
    }

    // Close file handles
    fclose($inputHandle);
    fclose($outputHandle);

    echo "Processing complete. Updated CSV saved to {$outputFile}\n";
}

// Run the script
processCSV($inputFile, $outputFile);

?>