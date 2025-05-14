import { Container, Box, Divider } from '@mui/material';
import ContactsAdmin from './ContactsAdmin';
import SupportRequestsAdmin from './SupportRequestsAdmin';

function AlertesPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box mb={4}>
        <ContactsAdmin />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box mt={4}>
        <SupportRequestsAdmin />
      </Box>
    </Container>
  );
}

export default AlertesPage;
