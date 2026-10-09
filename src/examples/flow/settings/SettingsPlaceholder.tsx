import React from 'react';
import fileText from '../../settings-assets/file-text-20.svg';
import {EmptyState, SettingsPage, SettingsSection} from './SettingsLayout';

/** Settings pages without a design yet (Billing, MCP), on the same page template. */
export function SettingsPlaceholder({title}: {title: string}) {
  return (
    <SettingsPage title={title}>
      <SettingsSection>
        <EmptyState icon={fileText} title="This page isn't designed yet" description="It will use one of the settings templates: Form, Collection or List–detail." />
      </SettingsSection>
    </SettingsPage>
  );
}
