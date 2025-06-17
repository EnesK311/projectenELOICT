# calculate_line_rate.py

import xml.etree.ElementTree as ET

def calculate_average_line_rate(cobertura_file):
    tree = ET.parse(cobertura_file)
    root = tree.getroot()

    line_rates = []

    for package in root.findall('packages/package'):
        for cls in package.findall('classes/class'):
            class_name = cls.get('name')
            line_rate = float(cls.get('line-rate'))

            if 'Controller' in class_name:
                line_rates.append(line_rate)

    if line_rates:
        average_line_rate = sum(line_rates) / len(line_rates)
        # Print the average in the format that GitLab can parse
        print(f"Average line-rate for Controller classes: {average_line_rate:.2f}")
        return average_line_rate * 100
    else:
        print("No classes containing 'Controller' found.")
        return 0.0  # Return 0 if no such classes are found

if __name__ == '__main__':
    cobertura_file = 'TestResults/coverage-report/Cobertura.xml'  # Path to Cobertura file
    average_line_rate = calculate_average_line_rate(cobertura_file)
    # Output the average line rate in the format GitLab can use in `coverage`
    print(f"##vso[task.setvariable variable=average_line_rate]{average_line_rate:.2f}")
