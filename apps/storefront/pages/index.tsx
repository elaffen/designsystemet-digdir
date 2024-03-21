/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ImageIcon,
  WrenchIcon,
  ComponentIcon,
  EnvelopeClosedIcon,
  BranchingIcon,
} from '@navikt/aksel-icons';
import type { SanityDocument } from 'next-sanity';

import {
  Banner,
  Section,
  NavigationCard,
  ImageSection,
  Footer,
  FooterPreview,
  Header,
  HeaderPreview,
} from '../components';
import { getClient } from '../sanity/lib/client';
import { token } from '../sanity/lib/token';
import { FOOTER_QUERY, MENU_QUERY } from '../sanity/lib/queries';

export const getStaticProps = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? token : undefined);
  const footer = await client.fetch<SanityDocument[]>(FOOTER_QUERY);
  const menu = await client.fetch<SanityDocument[]>(MENU_QUERY);
  return {
    props: {
      footer,
      menu,
      draftMode,
      token: draftMode ? token : '',
    },
  };
};

type FrontpageProps = {
  footer: SanityDocument[];
  menu: SanityDocument[];
  draftMode: boolean;
  token: string;
};

const Frontpage = (props: FrontpageProps) => {
  return (
    <div>
      {props.draftMode ? (
        <HeaderPreview menu={props.menu} />
      ) : (
        <Header menu={props.menu[0].menu} />
      )}
      <Banner
        title='Designsystemet'
        desc='Designsystemet består av grunnleggende designelementer, komponenter og mønstre du kan bruke når du utvikler tjenester. Vi håper dette kan bli en felles verktøykasse der vi samarbeider på tvers om å lage det beste grunnlaget for offentlige tjenester.'
      ></Banner>

      <Section title='Kom i gang'>
        <NavigationCard
          title='For designere'
          description='Lær hvordan du kommer i gang med designsystemet som designer.'
          color='blue'
          url='/grunnleggende/for-designere/kom-i-gang'
          icon={<ImageIcon fontSize={34} />}
        ></NavigationCard>

        <NavigationCard
          title='For utviklere'
          description='Lær hvordan du kommer i gang med designsystemet som utvikler.'
          color='yellow'
          url='/grunnleggende/for-utviklere/kom-i-gang'
          icon={<WrenchIcon fontSize={36} />}
        ></NavigationCard>

        <NavigationCard
          title='Komponenter'
          description='Se oversikten over UI-komponentene som er laget i react.'
          color='red'
          url='https://storybook.designsystemet.no'
          icon={<ComponentIcon fontSize={34} />}
        ></NavigationCard>
      </Section>

      <ImageSection
        title='Bli med på samarbeidet?'
        description='Et samarbeid om designsystem kan bidra til mer helhetlige brukeropplevelser på tvers av offentlig sektor og samtidig spare oss for å gjøre de samme oppgavene flere ganger. Vi ønsker at dette skal bli et felles hjem for gjenbrukbare komponenter, god praksis, interaksjonsmønstre, brukerdialog, innsikt og mer. Vil du høre mer om dette, eller bli med på samarbeidet?'
        imgSrc='/img/people-holding-figures.svg'
        imgAlt='Bilde av 2 personer som går bortover med byggeklosser under armene'
        headingLevel='h2'
        imgWidth={1195}
        imgHeight={270}
        buttons={[
          {
            text: 'Ta kontakt',
            href: 'mailto:designsystem@digdir.no',
            prefix: <EnvelopeClosedIcon fontSize={24} />,
          },
          {
            text: 'Bli med i Slack-kanalen',
            href: 'https://join.slack.com/t/designsystemet/shared_invite/zt-2438eotl3-a4266Vd2IeqMWO8TBw5PrQ',
            prefix: (
              <img
                src='img/slack-logo.png'
                alt=''
              />
            ),
          },
          {
            text: 'Github',
            href: 'https://github.com/digdir/designsystemet',
            prefix: <BranchingIcon fontSize={24} />,
          },
        ]}
      />
      {props.draftMode ? (
        <FooterPreview data={props.footer} />
      ) : (
        <Footer data={props.footer} />
      )}
    </div>
  );
};

export default Frontpage;
