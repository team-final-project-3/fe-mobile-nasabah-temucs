import React from 'react';
import { View, Text } from 'react-native';
import TicketDetailSection from '../components/TicketDetailSection'
import TicketBranchDetail from '../components/TicketBranchDetail';
import TicketCard from '../components/TicketCard';
import TicketServiceDetail from '../components/TicketServiceDetail';
import QueueSummaryFetcher from './QueueSummaryFetcher.js';

const TicketSummaryCard = ({
  ticketData,
  countdown,
  estimatedTimeFormatted,
  currentDate,
  userLocationData,
  documents = [], 
}) => {
  if (!ticketData) return null;

  const { ticketNumber, branch, services = [], status } = ticketData;

  return (
    <View>
      <TicketDetailSection title="Cabang Terpilih">
        <TicketBranchDetail branchData={branch} userLocationData={userLocationData} />
      </TicketDetailSection>

      <TicketCard
        status={status}
        bankName="Bank Negara Indonesia"
        branchName={`Kantor Cabang ${branch?.name || 'Tidak Dikenal'}`}
        queueNumber={ticketNumber || 'Loading'}
        ticketDate={currentDate}
        estimatedTime={estimatedTimeFormatted}
        countdown={countdown}
      />

      <TicketDetailSection title="Jenis Layanan">
        <TicketServiceDetail selectedServiceNames={services.map(s => s.serviceName)} />
      </TicketDetailSection>

      {documents.length > 0 && (
      <TicketDetailSection title="Dokumen Persyaratan">
        {documents.map((doc, index) => (
          <View key={index} style={{ paddingVertical: 4, paddingHorizontal: 12 }}>
            <Text style={{ fontSize: 14, color: '#333' }}>
              {`\u2022 ${doc.requirementName || doc.name || 'Dokumen Tidak Dikenal'}`}
            </Text>
          </View>
        ))}
      </TicketDetailSection>
    )}

      {(status === 'waiting' || status === 'in progress') && branch?.id && (
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <QueueSummaryFetcher branchId={branch.id} showWaiting={true} />
        </View>
      )}
    </View>
  );
};

export default TicketSummaryCard;
