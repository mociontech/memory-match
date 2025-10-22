import React, { createContext, useContext, useState } from 'react';

const AttendeeContext = createContext(undefined);

export const AttendeeProvider = ({ children }) => {
  const [attendeeId, setAttendeeId] = useState(null);

  return (
    <AttendeeContext.Provider value={{ attendeeId, setAttendeeId }}>
      {children}
    </AttendeeContext.Provider>
  );
};

export const useAttendee = () => {
  const ctx = useContext(AttendeeContext);
  if (!ctx) {
    throw new Error('useAttendee must be used within AttendeeProvider');
  }
  return ctx;
};


export { AttendeeContext };