import { OutputBlock } from "@/components/outputs/OutputBlock";
import { Heading } from "@/components/outputs/Heading";
import { ContactRow } from "@/components/outputs/ContactRow";
import { portfolio } from "@/lib/portfolio";
import { asset, externalUrl } from "@/lib/site";

const { contact } = portfolio;

export function Contact() {
  return (
    <OutputBlock>
      <Heading>contact</Heading>
      <div className="contact-list">
        <ContactRow label="email">
          <a className="link" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </ContactRow>
        <ContactRow label="phone">
          <a className="link" href={`tel:${contact.phone.replace(/\s/g, "")}`}>
            {contact.phone}
          </a>
        </ContactRow>
        <ContactRow label="location">
          <span className="str">{contact.location}</span>
        </ContactRow>
        <ContactRow label="linkedin">
          <a className="link" href={externalUrl(contact.linkedin)} target="_blank" rel="noreferrer">
            {contact.linkedin}
          </a>
        </ContactRow>
        <ContactRow label="github">
          <a className="link" href={externalUrl(contact.github)} target="_blank" rel="noreferrer">
            {contact.github}
          </a>
        </ContactRow>
        <ContactRow label="resume">
          <a className="link" href={asset(contact.cv)} download>
            download CV (.pdf)
          </a>
        </ContactRow>
      </div>
      <div className="row cmt" style={{ marginTop: 10 }}>
        {"// I usually reply faster than CI on a Monday morning."}
      </div>
    </OutputBlock>
  );
}
