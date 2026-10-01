"use client";

import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { ContactRow } from "@/components/outputs/ContactRow";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useMessages } from "@/hooks/useMessages";
import { asset, externalUrl } from "@/lib/site";

export function Contact() {
  const { contact } = usePortfolio();
  const t = useMessages();

  return (
    <OutputBlock>
      <Heading>{t.headings.contact}</Heading>
      <div className="contact-list">
        <ContactRow label={t.contact.labels.email}>
          <a className="link" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </ContactRow>
        <ContactRow label={t.contact.labels.location}>
          <span className="str">{contact.location}</span>
        </ContactRow>
        <ContactRow label={t.contact.labels.linkedin}>
          <a className="link" href={externalUrl(contact.linkedin)} target="_blank" rel="noreferrer">
            {contact.linkedin}
          </a>
        </ContactRow>
        <ContactRow label={t.contact.labels.github}>
          <a className="link" href={externalUrl(contact.github)} target="_blank" rel="noreferrer">
            {contact.github}
          </a>
        </ContactRow>
        <ContactRow label={t.contact.labels.resume}>
          <a className="link" href={asset(contact.cv)} download>
            {t.contact.downloadCv}
          </a>
        </ContactRow>
      </div>
      <div className="row cmt" style={{ marginTop: 10 }}>
        {t.contact.replyNote}
      </div>
    </OutputBlock>
  );
}
