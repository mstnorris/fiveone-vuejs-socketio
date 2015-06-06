<?php namespace SomethingGoodHappenedToday\Events;

use SomethingGoodHappenedToday\Events\Event;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class MyEventNameHere extends Event implements ShouldBroadcast
{
    use SerializesModels;

    public $data;
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->data = array(
            'power'=> '10'
        );
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return ['test-channel'];
    }
}