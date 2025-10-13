import Footer from './footer';
import Header from './header';

<template>
  <section class="authentication-layout">
    <div class="authentication-layout__image" role="presentation">
      <img alt="" src="/images/authentication.svg" />
    </div>

    <div class="authentication-layout__main">
      <Header>
        {{yield to="header"}}
      </Header>

      <main ...attributes>
        {{yield to="content"}}
      </main>

      <Footer />
    </div>
  </section>
</template>
