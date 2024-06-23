import React, { useState } from 'react';
import { Container, VStack, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton } from '@chakra-ui/react';
import { FaTrash, FaDownload } from 'react-icons/fa';
import Papa from 'papaparse';

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setHeaders(result.meta.fields);
          setCsvData(result.data);
        },
      });
    }
  };

  const handleAddRow = () => {
    setCsvData([...csvData, {}]);
  };

  const handleRemoveRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'edited_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e, rowIndex, columnName) => {
    const newData = [...csvData];
    newData[rowIndex][columnName] = e.target.value;
    setCsvData(newData);
  };

  return (
    <Container centerContent maxW="container.xl" py={10}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">CSV Upload, Edit, and Download Tool</Text>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        {csvData.length > 0 && (
          <>
            <Button onClick={handleAddRow} colorScheme="teal">Add Row</Button>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {headers.map((header, index) => (
                    <Th key={index}>{header}</Th>
                  ))}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {csvData.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {headers.map((header, colIndex) => (
                      <Td key={colIndex}>
                        <Input
                          value={row[header] || ''}
                          onChange={(e) => handleInputChange(e, rowIndex, header)}
                        />
                      </Td>
                    ))}
                    <Td>
                      <IconButton
                        aria-label="Delete row"
                        icon={<FaTrash />}
                        colorScheme="red"
                        onClick={() => handleRemoveRow(rowIndex)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button onClick={handleDownload} colorScheme="blue" leftIcon={<FaDownload />}>Download CSV</Button>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;