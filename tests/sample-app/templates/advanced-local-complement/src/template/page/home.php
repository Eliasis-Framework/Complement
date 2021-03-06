<?php
/**
 * PHP library for adding addition of complements for Eliasis Framework.
 *
 * @author    Josantonius <hello@josantonius.com>
 * @copyright 2017 - 2018 (c) Josantonius - Eliasis Complement
 * @license   https://opensource.org/licenses/MIT - The MIT License (MIT)
 * @link      https://github.com/Eliasis-Framework/Complement
 * @since     1.1.1
 */
use Eliasis\Framework\View;
use Josantonius\Hook\Hook;

echo View::getOption('test');
?>
    <body>
        <?php Hook::doAction('after-body'); ?>
    </body>
